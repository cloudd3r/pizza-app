---
name: checkout-testing
description: How to test pizza-app's checkout → YooKassa payment-redirect flow end-to-end on local dev. Use this when changing app/actions.ts createOrder, app/(checkout)/checkout/page.tsx, lib/creat-payment.ts, lib/send-email.ts, or anything that touches the order-create / payment-redirect critical path.
---

# pizza-app checkout & payment-redirect testing

## What this flow looks like

`/checkout` → user fills form → click "Перейти к оплате" → `submitOrder` calls server action `createOrder` (`app/actions.ts`) → on resolve does `location.href = url` where `url` is the YooKassa-hosted payment URL. Anything that throws inside `createOrder` between cart-found and `return paymentUrl` will silently break the redirect (the outer `try/catch` historically swallowed errors and returned `undefined`, which the client treats as "don't navigate"). Test always at the URL-bar level — that's the user-observable signal.

## The Resend `onboarding@resend.dev` gotcha (high-incidence)

`lib/send-email.ts` uses `from: 'onboarding@resend.dev'`. That's Resend's testing address: it accepts sends **only** to the email of the account that owns the API key. Sending to any other address returns HTTP 403 *"You can only send testing emails to your own email address (<owner-email>). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain."*

In dev / Vercel preview / production-without-verified-domain, **any `createOrder` flow that calls `sendEmail` to an arbitrary user email will throw** — this is a frequent root cause of "клик на оплатить ничего не делает" reports. The fix in PR #7 wraps `sendEmail` in its own non-fatal try/catch so Resend failures cannot block the redirect; if you re-introduce a `sendEmail` call elsewhere on the payment-critical path, wrap it the same way.

## Bypass OTP modal for redirect tests

The phone-OTP gate from PR #6 opens a modal whenever `verifiedPhonesRef.has(normalizedPhone) === false` for the phone in the form. To isolate the createOrder/redirect path from the OTP flow, log in as a user who already has `phoneVerified` set, and put that user's verified phone in the form. `verifiedPhonesRef` is hydrated from `/api/auth/me` on mount, so once that user is logged in `submitOrder` is called directly without the modal.

Quick way to give an existing user a verified phone (off-camera, one-time setup):

```bash
cat > scripts/_phone-verify-test-user.mjs <<'EOF'
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const u = await p.user.update({
  where: { email: 'user@test.com' },
  data: { phone: '+79991234599', phoneVerified: new Date() },
});
console.log(u);
await p.$disconnect();
EOF
node scripts/_phone-verify-test-user.mjs
```

Note the seeded test user is `user@test.com` (NOT `user@test.ru` — `AGENTS.md` is wrong on this; the seed `prisma/seed.ts` uses `.com`).

Alternative: re-use an existing phone-only "Гость" user that earlier tests created via the OTP flow. They have synthetic emails like `phone-79991234501@phone.local`, no password, and only sign in via the phone-OTP NextAuth credentials provider. To get into one of these accounts in a fresh browser session, you need to actually go through the OTP flow once — which is fine if `TELEGRAM_GATEWAY_DEV_LOG_ONLY=1` (codes print to the dev console).

## Restore cart state between submit clicks

`createOrder` empties the cart immediately after creating the `Order` row, **before** ever calling `sendEmail` or returning the URL. This means after one submit click — even one that didn't redirect — the cart is empty in DB. The browser's Zustand cart store may still show the old items from localStorage, but the next submit will throw `Cart is empty` because the server checks the DB cart.

If you need to do multiple submit clicks (e.g. for adversarial side-by-side broken-vs-fixed tests), repopulate the cart between clicks via the same anonymous-cart curl pattern from `cart-testing`:

```bash
CART_TOKEN=$(grep -oE 'cartToken=[^;]+' /tmp/browser-cookies-or-from-devtools | head -1 | cut -d= -f2)
curl -sS -X POST http://localhost:3000/api/cart \
  -H 'Content-Type: application/json' \
  -H "Cookie: cartToken=$CART_TOKEN" \
  -d '{"productItemId":1}' -w '\nHTTP %{http_code}\n'
```

Get the `cartToken` cookie value via the DevTools console (`document.cookie`) or the `computer.console` tool — it's not HttpOnly. After this, the server-side cart has items again; refresh the checkout page (or just submit) and the totals will repopulate.

## Adversarial side-by-side: prove the fix actually fixes

If a PR's claim is "this code path was broken, this PR fixes it", the strongest evidence is to run the BROKEN code and the FIXED code in the same browser session, same dev server, same network, same auth, same cart state — and show the user-visible outcome differs. Recipe:

1. Save the master version of the changed file: `git show master:app/actions.ts > /tmp/actions-master.ts`.
2. Save the PR version (your current working copy) too: `cp app/actions.ts /tmp/actions-pr.ts`.
3. Swap to BROKEN: `cp /tmp/actions-master.ts app/actions.ts`. Server actions hot-reload in `next dev` — no restart needed. (You'll know it worked when the server log shows the broken-version's error message on the next request.)
4. Run the test once, observe the broken UX (URL doesn't change, etc.). Capture screenshots / DB rows / log lines.
5. Re-populate cart (see above) — the broken click still created the Order and emptied the cart.
6. Swap to FIXED: `cp /tmp/actions-pr.ts app/actions.ts`.
7. Run the test again, observe the fixed UX (URL changes to `yoomoney.ru/checkout/...`).
8. **At the end, restore the working tree to the PR version** — verify with `git diff app/actions.ts` showing no unintended changes.

Only the two file-swap steps differ between runs; all other variables are held constant, so any difference in outcome is attributable to the diff under test. If both runs behave identically, the PR isn't actually exercising the code path it claims to fix and you need to either re-ground the test or revisit the diagnosis.

## DB & log spot-checks

Useful read-only assertions during a checkout test:

```bash
# Newest few orders + their paymentId / status
node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.order.findMany({orderBy:{id:'desc'},take:3,select:{id:true,userId:true,phone:true,status:true,totalAmount:true,paymentId:true,createdAt:true}}).then(r=>{console.log(JSON.stringify(r,null,2));return p.\$disconnect();})"

# Filter Next dev log for the createOrder code path
tail -200 /tmp/next-dev.log | grep -E 'CreateOrder|POST /checkout|sendEmail failed'
```

The `paymentId` on the newest `Order` row should match the `orderId` query param in the YooKassa URL the browser landed on — strong end-to-end signal that the redirect target is the order that exact click created.

## What this skill does NOT cover

- The OTP send/verify path itself (different file set; rare on a payment-redirect bug).
- YooKassa payment-completion webhook (`app/api/checkout/callback/route.ts`) — that's a separate flow exercised by YooKassa hitting your dev tunnel, not by clicking the pay button.
- Domain-verified Resend production sends — when the user verifies a domain at resend.com/domains and updates `lib/send-email.ts:7`, the gotcha above goes away. Out of scope for current testing.

## Devin Secrets needed

- `PIZZA_APP_DOTENV` (org-scope, contains `RESEND_API_KEY`, `YOOKASSA_*`, `POSTGRES_URL*`, `TELEGRAM_GATEWAY_DEV_LOG_ONLY=1`, `NEXTAUTH_SECRET`, etc.).
