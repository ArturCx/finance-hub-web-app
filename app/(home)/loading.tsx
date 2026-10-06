import PageSkeleton from "../_components/pageSkeleton";
import { Skeleton } from "../_components/ui/skeleton";

const Loading = () => (
  <PageSkeleton>
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-[140px] rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[118px] rounded-2xl" />
          ))}
        </div>
        <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
          <Skeleton className="h-[300px] rounded-2xl lg:w-1/3" />
          <Skeleton className="h-[300px] flex-1 rounded-2xl" />
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-[360px] rounded-2xl" />
        <Skeleton className="h-[220px] rounded-2xl" />
      </div>
    </div>
  </PageSkeleton>
);

export default Loading;
