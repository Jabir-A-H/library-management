import {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
  EmblaViewportRefType,
} from 'embla-carousel-react';
import React from 'react';

export interface CarouselContextType {
  carouselRef: EmblaViewportRefType; // EmblaViewportRefType is compatible with React.RefObject<HTMLDivElement>
  api?: EmblaCarouselType;
  opts?: EmblaOptionsType;
  orientation: 'horizontal' | 'vertical';
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  opts?: EmblaOptionsType;
  setApi?: (api: EmblaCarouselType) => void;
  plugins?: EmblaPluginType[];
  className?: string;
  children?: React.ReactNode;
}

export interface CarouselContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export interface CarouselButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
