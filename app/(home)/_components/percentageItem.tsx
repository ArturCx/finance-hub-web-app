import { ReactNode } from "react";

interface PercentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-200 hover:bg-accent/50">
      {/* Icone */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white bg-opacity-[5%] p-2">{icon}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="text-sm font-bold tabular-nums">{value}%</p>
    </div>
  );
};

export default PercentageItem;
