import Skeleton from "@/shared/ui/skeleton";
export const UserDetailPageSkeleton = () => {
  return (
    <div class="flex grow flex-col space-y-4">
      <Skeleton class="size-24 self-center rounded-full" opacity={75} />

      <Skeleton class="mb-8 size-9 w-1/2 self-center rounded-lg" opacity={25} />

      <Skeleton class="size-22 w-full rounded-lg" opacity={50} />

      <Skeleton class="size-11 w-full rounded-lg" opacity={50} />
      
      <Skeleton class="size-22 w-full rounded-lg" opacity={50} />

      <Skeleton class="size-11 w-full rounded-lg" opacity={50} />

      <Skeleton class="size-11 w-full rounded-lg" opacity={50} />
    </div>
  );
};
