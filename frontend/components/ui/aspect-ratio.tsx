import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

/**
 * AspectRatio component for maintaining a consistent aspect ratio for content.
 */
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>((props, ref) => {
  return (
    <AspectRatioPrimitive.Root ref={ref} data-slot="aspect-ratio" {...props} />
  );
});
AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
