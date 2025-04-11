import Skeleton from "@/shared/ui/skeleton";

export const MapPageSkeleton = () => (
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <Skeleton class="h-5 w-30" />
      <Skeleton class="h-5 w-30" />
    </div>
  </div>
);
