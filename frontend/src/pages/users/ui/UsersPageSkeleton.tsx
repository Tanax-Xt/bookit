import Skeleton from "@/shared/ui/skeleton";

export const UsersPageSkeleton = () => {
  return (
    <div class="flex flex-col space-y-4">
      <Skeleton class="h-21 w-full rounded-lg py-2" />
      <Skeleton class="h-21 w-full rounded-lg py-2" />
      <Skeleton class="h-21 w-full rounded-lg py-2" />
      <Skeleton class="h-21 w-full rounded-lg py-2" />
      <Skeleton class="h-21 w-full rounded-lg py-2" />
    </div>
  );
};
