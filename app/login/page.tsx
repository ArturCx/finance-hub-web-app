import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      {/*Esquerda */}
      <div className="relative flex h-full flex-col justify-center bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.08),transparent_60%)]">
        <div className="flex flex-col justify-center p-6 md:p-8 max-w-[550px] mx-auto w-full animate-fade-in-up">
          <Image
            src="/logo.svg"
            width={173}
            height={40}
            alt="Finance Hub Logo"
            className="mb-8 pl-1"
          />
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Bem Vindo!</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
            A Finance Hub é uma plataforma de gestão financeira inteligente para
            monitorar suas movimentações, oferecer insights personalizados,
            mostrar a cotação de suas criptomoedas, te avisar de contas a vencer
            e muito mais!
          </p>
          <SignInButton>
            <Button size="lg" className="w-full sm:w-auto">
              <LogInIcon className="mr-2" />
              Fazer login ou criar conta
            </Button>
          </SignInButton>
        </div>
      </div>
      {/*Direita */}
      <div className="relative h-full w-full hidden lg:block overflow-hidden">
        <Image
          src="/login.webp"
          alt="Faça login"
          fill
          className="object-cover animate-fade-in"
        />
      </div>
    </div>
  );
};

export default LoginPage;
