import {
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  Bitcoin,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const CHART_POINTS =
  "M0,82 C20,78 30,70 50,72 C70,74 80,58 100,56 C120,54 130,64 150,60 C170,56 180,40 200,42 C220,44 230,30 250,28 C270,26 285,18 300,14";

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl";

const HeroPreview = () => {
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden bg-[#050b10]"
    >
      <div className="absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full bg-primary/30 blur-[120px] animate-pulse-glow" />
      <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse-glow animation-delay-400" />
      <div className="absolute right-1/4 top-0 h-[260px] w-[260px] rounded-full bg-indigo-500/20 blur-[100px]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative flex h-full items-center justify-center p-10">
        <div className="relative w-full max-w-[460px]">
          <div className={`${glass} p-6 animate-scale-in`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Saldo total
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                  R$ 24.580,90
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-sucess/15 px-2.5 py-1 text-xs font-semibold text-sucess">
                <TrendingUp className="h-3.5 w-3.5" />
                +12,4%
              </span>
            </div>

            <svg viewBox="0 0 300 100" className="mt-6 h-32 w-full">
              <defs>
                <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0097b2" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0097b2" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#0097b2" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="300"
                  y1={y}
                  y2={y}
                  stroke="white"
                  strokeOpacity="0.06"
                  strokeDasharray="4 4"
                />
              ))}
              <path
                d={`${CHART_POINTS} L300,100 L0,100 Z`}
                fill="url(#hero-area)"
                className="animate-fade-in animation-delay-400"
              />
              <path
                d={CHART_POINTS}
                fill="none"
                stroke="url(#hero-line)"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                className="animate-draw"
              />
              <circle cx="300" cy="14" r="4" fill="#34d399" />
              <circle
                cx="300"
                cy="14"
                r="9"
                fill="#34d399"
                fillOpacity="0.25"
                className="animate-ping-slow"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </svg>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <ArrowUpRight className="h-3.5 w-3.5 text-sucess" />
                  Receitas
                </p>
                <p className="mt-1 font-semibold tabular-nums text-white">
                  R$ 9.200,00
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <ArrowDownRight className="h-3.5 w-3.5 text-danger" />
                  Despesas
                </p>
                <p className="mt-1 font-semibold tabular-nums text-white">
                  R$ 4.318,40
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${glass} absolute -right-10 -top-14 w-52 p-4 animate-float animation-delay-200`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15">
                <Bitcoin className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Bitcoin</p>
                <p className="text-xs text-white/50">BTC</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-sucess">
                +3,2%
              </span>
            </div>
            <svg viewBox="0 0 100 24" className="mt-3 h-6 w-full">
              <polyline
                points="0,18 12,16 22,19 34,12 46,14 58,8 70,10 82,5 100,3"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className={`${glass} absolute -bottom-12 -left-12 flex w-64 items-center gap-3 p-4 animate-float-slow`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/15">
              <BellRing className="h-5 w-5 text-danger" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Conta de luz</p>
              <p className="text-xs text-white/50">Vence em 3 dias · R$ 187,30</p>
            </div>
          </div>

          <div
            className={`${glass} absolute -right-16 bottom-16 w-56 p-4 animate-float animation-delay-300`}
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Insight da IA
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Você gastou <span className="font-semibold text-white">18% menos</span>{" "}
              com restaurantes este mês. Continue assim!
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export default HeroPreview;
