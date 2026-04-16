'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ImageLightboxProps {
  images: string[];
  startIndex?: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ImageLightbox({ images, startIndex = 0, isOpen, onOpenChange }: ImageLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCarouselInfo = () => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
    }

    updateCarouselInfo();
    api.on('select', updateCarouselInfo);
    api.on('reInit', updateCarouselInfo);

    return () => {
      api?.off('select', updateCarouselInfo);
      api?.off('reInit', updateCarouselInfo);
    };
  }, [api]);

  useEffect(() => {
    if (api && isOpen) {
      // Ensure the carousel is correctly initialized to the startIndex when opened
      setTimeout(() => api.scrollTo(startIndex, true), 0);
    }
  }, [api, isOpen, startIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            api?.scrollNext();
        } else if (e.key === 'ArrowLeft') {
            api?.scrollPrev();
        } else if (e.key === 'Escape') {
            onOpenChange(false);
        }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [api, isOpen, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent shadow-none border-0 p-0 w-screen h-screen flex items-center justify-center">
        <DialogTitle className="sr-only">Галерея изображений</DialogTitle>
        <DialogDescription className="sr-only">
          Лайтбокс с галереей изображений. Используйте стрелки для навигации между изображениями или клавишу Escape для закрытия.
        </DialogDescription>
        
        <Carousel
          setApi={setApi}
          opts={{ startIndex, loop: true }}
          className="w-full max-w-5xl aspect-video"
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-full">
                   <Image src={src} alt={`Lightbox image ${index + 1}`} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-contain" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20 border-0 h-12 w-12" />
           <CarouselNext className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/20 border-0 h-12 w-12" />
        </Carousel>

        <div className="absolute top-4 right-4 text-white z-20">
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="hover:bg-white/20 rounded-full h-12 w-12">
            <X className="h-8 w-8" />
          </Button>
        </div>
         {count > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white z-20 bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
                {current} / {count}
            </div>
         )}
      </DialogContent>
    </Dialog>
  );
}
