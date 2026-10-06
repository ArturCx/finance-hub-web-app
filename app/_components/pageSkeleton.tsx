import Navbar from "./navbar";
import { Skeleton } from "./ui/skeleton";

interface PageSkeletonProps {
  children: React.ReactNode;
}

const PageSkeleton = ({ children }: PageSkeletonProps) => {
  return (
    <>
      <Navbar />
      <div
        aria-busy
        aria-label="Carregando"
        className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden p-4 md:space-y-6 md:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="hidden h-11 w-11 sm:block" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        {children}
      </div>
    </>
  );
};

export const TableSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
    <Skeleton className="h-11 rounded-none" />
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-4 border-t border-white/[0.05] px-4 py-4"
      >
        <Skeleton className="h-4 flex-[2]" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="hidden h-4 flex-1 md:block" />
        <Skeleton className="hidden h-4 flex-1 md:block" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

export default PageSkeleton;
