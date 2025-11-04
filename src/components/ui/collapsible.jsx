"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible@1.1.3";

// Removed type annotation for props
function Collapsible({
  ...props
}) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

// Removed type annotation for props
function CollapsibleTrigger({
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

// Removed type annotation for props
function CollapsibleContent({
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };