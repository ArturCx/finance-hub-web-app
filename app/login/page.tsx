import Image from "next/image";
import { Button } from "../_components/ui/button";
import {
  BellRing,
  Bitcoin,
  LineChart,
  LogInIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeroPreview from "./_components/heroPreview";

const FEATURES = [
  {
    icon: LineChart,
    title: "Visão completa",
    description: "Receitas, despesas e investimentos em um só lugar.",
  },
  {
    icon: Sparkles,
    title: "Relatórios com IA",
    description: "Insights personalizados sobre seus hábitos.",
  },
  {
    icon: Bitcoin,
    title: "Criptomoedas",
    description: "Cotações atualizadas da sua carteira.",
  },
  {
    icon: BellRing,
    title: "Contas a vencer",
    description: "Avisos antes do vencimento, sem sustos.",
  },
];

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      <div className="relative flex h-full flex-col overflow-y-auto">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[120px] lg:hidden" />

        <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center p-6 md:p-10">
          <Image
            src="/logo.svg"
            width={173}
            height={40}
            alt="Finance Hub Logo"
            className="mb-10 pl-1 animate-fade-in"
          />

          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5" />
            Gestão financeira inteligente
          </span>

          <h1 className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl animate-fade-in-up animation-delay-100">
            Seu dinheiro,{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              sob controle.
            </span>
          </h1>

          <p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base animate-fade-in-up animation-delay-200">
            Monitore suas movimentações, receba insights personalizados e
            acompanhe tudo o que importa para a sua vida financeira.
          </p>

          <ul className="mb-10 grid gap-3 sm:grid-cols-2 animate-fade-in-up animation-delay-300">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="animate-fade-in-up animation-delay-400">
            <SignInButton>
              <Button
                size="lg"
                className="w-full shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40 sm:w-auto"
              >
                <LogInIcon className="mr-2" />
                Fazer login ou criar conta
              </Button>
            </SignInButton>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-sucess" />
              Acesso seguro e criptografado
            </p>
          </div>
        </div>
      </div>
      <div className="hidden h-full lg:block">
        <HeroPreview />
      </div>
    </div>
  );
};

export default LoginPage;
