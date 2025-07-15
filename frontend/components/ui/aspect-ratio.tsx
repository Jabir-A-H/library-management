import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatio component for maintaining a consistent aspect ratio for content.
 * @param {AspectRatioPrimitive.AspectRatioProps} props
 * @returns {JSX.Element}
 */
function AspectRatio(props) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
