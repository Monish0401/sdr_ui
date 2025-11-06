import { cn } from "./utils";

// Removed type annotation for props: React.ComponentProps<"div">
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };