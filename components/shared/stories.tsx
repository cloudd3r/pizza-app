'use client';

import { Api } from '@/services/api-client';
import { IStory } from '@/services/stories';
import React from 'react';
import { Container } from './container';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ReactStories from 'react-insta-stories';

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = React.useState(0);

  const selectedStory = stories[selectedStoryIndex];

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onClickStory = (index: number) => {
    const story = stories[index];
    setSelectedStoryIndex(index);

    if (story.items.length > 0) {
      setOpen(true);
    }
  };

  const openPreviousStory = () => {
    setSelectedStoryIndex((index) =>
      index === 0 ? stories.length - 1 : index - 1,
    );
  };

  const openNextStory = () => {
    setSelectedStoryIndex((index) =>
      index === stories.length - 1 ? 0 : index + 1,
    );
  };

  const closeOrOpenNextStory = () => {
    if (stories.length <= 1 || selectedStoryIndex === stories.length - 1) {
      setOpen(false);
      return;
    }

    openNextStory();
  };

  return (
    <>
      <Container
        className={cn(
          'flex items-center gap-2 my-8 overflow-x-auto pb-1 scrollbar',
          className
        )}
      >
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className='h-[204px] min-w-[164px] bg-gray-100 rounded-3xl animate-pulse'
            />
          ))}

        {stories.map((story, index) => (
          <button
            key={story.id}
            type='button'
            onClick={() => onClickStory(index)}
            className='group relative h-[204px] min-w-[164px] overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'
          >
            <img
              className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
              height={204}
              width={164}
              src={story.previewImageUrl}
              alt={`Story ${story.id}`}
            />
            <span className='pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5' />
            <span className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-80' />
          </button>
        ))}
      </Container>

      {open && selectedStory && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm'>
          <div className='relative flex items-center justify-center'>
            {stories.length > 1 && (
              <button
                type='button'
                onClick={openPreviousStory}
                className='absolute -left-20 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:flex'
                aria-label='Previous story'
              >
                <ChevronLeft className='h-8 w-8' />
              </button>
            )}

            <div className='relative overflow-hidden rounded-[28px] bg-black shadow-2xl'>
              <button
                type='button'
                className='absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition hover:bg-white hover:text-gray-900'
                onClick={() => setOpen(false)}
                aria-label='Close stories'
              >
                <X className='h-5 w-5' />
              </button>

              <ReactStories
                key={selectedStory.id}
                onAllStoriesEnd={closeOrOpenNextStory}
                stories={
                  selectedStory.items.map((item) => ({
                    url: item.sourceUrl,
                  })) || []
                }
                defaultInterval={4500}
                width={450}
                height={720}
                keyboardNavigation
                storyContainerStyles={{
                  borderRadius: 28,
                  overflow: 'hidden',
                  backgroundColor: '#111',
                }}
                storyStyles={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {stories.length > 1 && (
              <button
                type='button'
                onClick={openNextStory}
                className='absolute -right-20 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 lg:flex'
                aria-label='Next story'
              >
                <ChevronRight className='h-8 w-8' />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
