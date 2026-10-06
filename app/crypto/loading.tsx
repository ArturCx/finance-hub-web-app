import PageSkeleton from "../_components/pageSkeleton";
import { Skeleton } from "../_components/ui/skeleton";

const Loading = () => (
  <PageSkeleton>
    <Skeleton className="h-10 w-full rounded-full sm:w-96" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[126px] rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr,360px]">
      <Skeleton className="h-[360px] rounded-2xl" />
      <Skeleton className="h-[360px] rounded-2xl" />
    </div>
  </PageSkeleton>
);

export default Loading;
