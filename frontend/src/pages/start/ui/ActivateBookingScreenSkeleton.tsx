import Skeleton from "@/shared/ui/skeleton";

export const ActivateBookingScreenSkeleton = () => {
  return (
    <div class="flex grow flex-col space-y-4">
      <div class="flex flex-col space-y-2">
        <Skeleton class="h-7 w-full rounded-lg" opacity={50} />

        <Skeleton class="h-11 w-full rounded-lg" opacity={50} />
      </div>

      <div class="flex flex-col space-y-2">
        <Skeleton class="h-7 w-full rounded-lg" opacity={50} />

        <Skeleton class="h-11 w-full rounded-lg max-lg:mt-auto" opacity={50} />
      </div>

      <Skeleton class="h-22 w-full rounded-lg" opacity={50} />

      <Skeleton class="h-100 w-100 self-center rounded-lg" opacity={50} />

      <Skeleton class="h-10 w-full rounded-lg max-lg:mt-auto" opacity={50} />
    </div>
  );
};
