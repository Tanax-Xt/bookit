import Skeleton from "@/shared/ui/skeleton";

export const NavSkeleton = () => {
  return (
    <>
      <div class="scrollbar-thin w-full grow space-y-1 overflow-x-clip overflow-y-auto">
        <Skeleton class="h-10 rounded-lg" opacity={25} />
        <Skeleton class="h-10 rounded-lg" opacity={25} />
        <Skeleton class="h-10 rounded-lg" opacity={25} />
        <Skeleton class="h-10 rounded-lg" opacity={25} />
      </div>

      <div class="w-full space-y-1">
        <Skeleton class="h-10 rounded-lg" opacity={25} />
      </div>
    </>
  );
};
