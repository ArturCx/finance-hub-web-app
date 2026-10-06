import PageSkeleton from "../_components/pageSkeleton";
import { Skeleton } from "../_components/ui/skeleton";

const Loading = () => (
  <PageSkeleton>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-[126px] rounded-2xl" />
      ))}
    </div>
    <Skeleton className="h-[74px] rounded-2xl" />
    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[1fr,360px]">
      <Skeleton className="h-[280px] rounded-2xl" />
      <Skeleton className="h-[200px] rounded-2xl" />
    </div>
  </PageSkeleton>
);

export default Loading;
