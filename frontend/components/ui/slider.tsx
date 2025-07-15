'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

/**
 * Props for the Slider component.
 * @property {string} [className] - Additional class names for styling.
 * @property {number[]} [defaultValue] - Default slider value(s).
 * @property {number[]} [value] - Controlled slider value(s).
 * @property {number} [min=0] - Minimum value.
 * @property {number} [max=100] - Maximum value.
 * @property {string} [aria-label] - Accessible label for the slider.
 * @property {...SliderPrimitive.SliderProps} [props] - Any other Radix slider props.
 */
export interface SliderProps extends SliderPrimitive.SliderProps {
  className?: string;
  'aria-label'?: string;
}

/**
 * Slider component. Wraps Radix Slider.Root, Track, Range, and Thumb.
 * Provides a customizable, accessible slider for forms and controls.
 *
 * @example
 * <Slider defaultValue={[50]} min={0} max={100} aria-label="Volume" />
 */
export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(function Slider(
  { className, defaultValue, value, min = 0, max = 100, ...props },
  ref
) {
  // Determine the number of thumbs to render based on value/defaultValue
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min],
    [value, defaultValue, min]
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = 'Slider';
