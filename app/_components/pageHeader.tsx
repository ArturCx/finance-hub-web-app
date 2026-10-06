import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ title, description, icon, children }: PageHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-3 animate-fade-in sm:flex-row sm:items-center md:gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-lg shadow-primary/10 sm:flex [&_svg]:size-5">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
};

export default PageHeader;
