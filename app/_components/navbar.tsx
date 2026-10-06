"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getResolvedMonthYear } from "@/app/_utils/monthYearFilter";
import { useEffect, useState } from "react";
import {
  ArrowDownUpIcon,
  BitcoinIcon,
  LayoutDashboardIcon,
  MenuIcon,
  ReceiptTextIcon,
  XIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboardIcon },
  { label: "Transações", path: "/transactions", icon: ArrowDownUpIcon },
  { label: "Contas", path: "/bills", icon: ReceiptTextIcon },
  { label: "Crypto", path: "/crypto", icon: BitcoinIcon },
];

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { month, year } = getResolvedMonthYear(
    searchParams.get("month"),
    searchParams.get("year")
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const getHref = (basePath: string) =>
    basePath === "/crypto" ? basePath : `${basePath}?month=${month}&year=${year}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07090c]/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href={getHref("/")}>
            <Image
              src="/logo.svg"
              width={130}
              height={40}
              alt="Finance AI"
              className="w-24 md:w-[130px] h-auto transition-opacity hover:opacity-80"
            />
          </Link>
          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={getHref(link.path)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-200 lg:px-4 ${
                    isActive
                      ? "bg-primary/15 font-bold text-primary shadow-inner shadow-primary/10 ring-1 ring-primary/30"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  }`}
                >
                  <Icon className="hidden h-4 w-4 lg:block" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <UserButton showName />
          </div>
          <div className="sm:hidden">
            <UserButton />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={getHref(link.path)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "font-bold text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
