import Skeleton from "@/shared/ui/skeleton";

export const ReservationListSkeleton = () => {
  return (
    <div class="flex w-full grow flex-col space-y-4">
      <div class="flex flex-col space-y-4">
        <div class="flex py-3">
          <Skeleton class="h-7 w-3/4 rounded-lg" opacity={50} />
        </div>

        <div class="space-y-2">
          <Skeleton class="h-16 w-full rounded-lg" opacity={25} />
          <Skeleton class="h-16 w-full rounded-lg" opacity={25} />
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <div class="flex py-3">
          <Skeleton class="h-7 w-3/4 rounded-lg" opacity={50} />
        </div>

        <div class="space-y-2">
          <Skeleton class="h-16 w-full rounded-lg" opacity={25} />
          <Skeleton class="h-16 w-full rounded-lg" opacity={25} />
          <Skeleton class="h-16 w-full rounded-lg" opacity={25} />
        </div>
      </div>
    </div>
  );
};
