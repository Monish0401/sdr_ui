"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// Removed type annotation for props: React.ComponentProps<typeof AspectRatioPrimitive.Root>
function AspectRatio({
  ...props
}) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };