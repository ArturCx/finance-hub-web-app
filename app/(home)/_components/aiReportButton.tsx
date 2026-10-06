"use client";

import FormDialogHeader from "@/app/_components/formDialogHeader";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BotIcon,
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { generateAiReport } from "../_actions/generateAiReport";

interface AiReportButtonProps {
  month: string;
  year: string;
}

const AiReportButton = ({ month, year }: AiReportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const periodLabel = format(new Date(Number(year), Number(month) - 1, 1), "MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateAiReport({ month, year });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setReport(result.report);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível gerar o relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full font-bold">
          <SparklesIcon className="text-primary" />
          <span className="hidden md:inline">Relatório IA</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <FormDialogHeader
          icon={<BotIcon />}
          title={`Relatório de ${periodLabel}`}
          description="Análise detalhada de onde seu dinheiro foi e onde dá para economizar."
        />

        {isLoading ? (
          <div className="relative space-y-3" aria-busy aria-label="Gerando relatório">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="mt-4 h-5 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-10/12" />
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Analisando suas transações...
            </p>
          </div>
        ) : report ? (
          <div className="relative max-h-[60vh] overflow-y-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <article className="prose prose-sm prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-6 prose-headings:text-base prose-headings:font-bold prose-headings:text-primary first:prose-headings:mt-0 prose-p:leading-relaxed prose-strong:text-foreground prose-li:my-1 prose-li:marker:text-primary">
              <Markdown>{report}</Markdown>
            </article>
          </div>
        ) : (
          <div className="relative space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-muted-foreground">
            <p>O relatório analisa o mês selecionado e mostra:</p>
            <ul className="list-inside list-disc space-y-1 marker:text-primary">
              <li>as categorias e os gastos que mais pesaram, com valores;</li>
              <li>ações concretas de economia, com o valor estimado por mês;</li>
              <li>contas em aberto, uso do cartão e progresso da meta;</li>
              <li>metas para o próximo mês.</li>
            </ul>
            <p className="flex items-start gap-2 pt-1 text-xs">
              <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Enviamos à IA apenas o resumo do mês (totais, categorias e descrições
              das despesas), sem nenhum dado de identificação da sua conta.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            {report && !isLoading && (
              <Button variant="ghost" onClick={handleCopy}>
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : report ? (
                <RefreshCwIcon />
              ) : (
                <SparklesIcon />
              )}
              {isLoading ? "Gerando..." : report ? "Gerar novamente" : "Gerar relatório"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
