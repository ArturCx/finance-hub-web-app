"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getResolvedMonthYear } from "@/app/_utils/monthYearFilter";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { label: "Dashboard", path: "/" },
  { label: "Transações", path: "/transactions" },
  { label: "Contas", path: "/bills" },
  { label: "Crypto", path: "/crypto" },
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
    <nav className="sticky top-0 z-50 border-b border-solid bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Esquerda */}
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
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={getHref(link.path)}
                  className={`relative py-1 text-sm lg:text-base transition-colors duration-200 hover:text-foreground after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                    isActive
                      ? "font-bold text-primary after:w-full"
                      : "text-muted-foreground after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Direita */}
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
      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={getHref(link.path)}
                  className={`rounded-md px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "font-bold text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
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
