import Navbar from "@/app/_components/navbar";
import { Skeleton } from "@/app/_components/ui/skeleton";

const Loading = () => (
  <>
    <Navbar />
    <div aria-busy className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden p-4 md:space-y-6 md:p-6">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-6 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr,340px]">
        <Skeleton className="h-[440px] rounded-2xl" />
        <Skeleton className="h-[440px] rounded-2xl" />
      </div>
    </div>
  </>
);

export default Loading;
