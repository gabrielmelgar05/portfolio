import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export function HeroSection() {
  const scope = useRef<HTMLElement>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!scope.current) return;

    let titleSplit: SplitText | null = null;
    let subtitleSplit: SplitText | null = null;
    let btnLabelSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      const run = async () => {
        try {
          await document.fonts?.ready;
        } catch {
          // ok, segue
        }

        const titleEl = scope.current?.querySelector("[data-split='title']") as HTMLElement | null;
        const subtitleEl = scope.current?.querySelector("[data-split='subtitle']") as HTMLElement | null;
        const btnLabelEls = scope.current?.querySelectorAll("[data-split='btn-label']") ?? [];

        if (!titleEl || !subtitleEl || btnLabelEls.length === 0) return;

        // Cria splits (mask cria “janela” pra subir de baixo pra cima) <sources>[1]</sources>
        titleSplit = SplitText.create(titleEl, {
          type: "chars",
          mask: "chars",
          charsClass: "char",
        });

        subtitleSplit = SplitText.create(subtitleEl, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
        });

        // SplitText em múltiplos elementos: cria um split por selector NodeList
        btnLabelSplit = SplitText.create(btnLabelEls, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
        });

        // Estados iniciais (SÓ depois do split existir)
        gsap.set(titleSplit.chars, { yPercent: 110 });
        gsap.set(subtitleSplit.lines, { yPercent: 110 });
        gsap.set(btnLabelSplit.lines, { yPercent: 110 });

        gsap.set(".btn", { scale: 0 });
        gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });

        const tl = gsap.timeline({ delay: 0.15 });

        tl.to(titleSplit.chars, {
          yPercent: 0,
          stagger: 0.04,
          duration: 1,
          ease: "power4.out",
        })
          .to(
            subtitleSplit.lines,
            {
              yPercent: 0,
              stagger: 0.12,
              duration: 0.9,
              ease: "power4.out",
            },
            "-=0.55"
          )
          .to(
            ".btn",
            {
              scale: 1,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.08,
            },
            "-=0.25"
          )
          .to(
            ".btn-icon",
            {
              clipPath: "circle(100% at 50% 50%)",
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.08,
            },
            "<"
          )
          .to(
            btnLabelSplit.lines,
            {
              yPercent: 0,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.06,
            },
            "<"
          );

        gsap.to("[data-anim='chevron']", {
          y: 6,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      };

      run();
    }, scope);

    return () => {
      ctx.revert();
      titleSplit?.revert();
      subtitleSplit?.revert();
      btnLabelSplit?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={scope} className="hero relative h-[100svh] w-full overflow-hidden bg-black text-white isolate">
      {/* BG */}
      <img src="/image-hero.png" alt="Hero" className="absolute inset-0 h-full w-full object-cover" />

      {/* Gradient (0/50/100) */}
      <div
        className="absolute inset-0 pointer-events-none
        bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,1)_100%)]"
      />

      {/* Top fade (nav) */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-black/60 to-black/0" />

      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
          <div className='text-lg tracking-[0.35em] uppercase text-white/90 [font-family:Nevera,system-ui,sans-serif]'>
            ARTEMIS
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/85 md:flex">
            <a className="transition hover:text-white" href="#mission">Mission</a>
            <a className="transition hover:text-white" href="#astronauts">Astronauts</a>
            <a className="transition hover:text-white" href="#technology">Technology</a>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center">
          <h1
            data-split="title"
            className='text-[56px] leading-none tracking-[0.04em] text-white sm:text-[72px] md:text-[126px]
            [font-family:Nevera,system-ui,sans-serif]'
          >
            ARTEMIS II
          </h1>

          <p
            data-split="subtitle"
            className="mx-auto mt-2 max-w-2xl text-base text-white/85 sm:text-lg md:text-[26px]"
          >
            Humanity&apos;s return to the Moon has begun.
          </p>

          {/* CTAs (estrutura necessária pro efeito do seu script) */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#mission"
              className="btn inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black
                         shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition hover:bg-white/95 active:scale-[0.99]"
            >
              <span className="btn-icon grid h-7 w-7 place-items-center rounded-full bg-black/10">
                <span className="block h-2 w-2 rounded-full bg-black/80" />
              </span>

              <span className="btn-label overflow-hidden leading-none">
                <span data-split="btn-label" className="block">
                  Explore the Mission
                </span>
              </span>
            </a>

            <a
              href="#technology"
              className="btn inline-flex items-center gap-3 rounded-lg bg-white/20 px-5 py-3 text-sm font-medium text-white
                         backdrop-blur-sm transition hover:bg-white/25 active:scale-[0.99]"
            >
              <span className="btn-icon grid h-7 w-7 place-items-center rounded-full bg-white/15">
                <span className="block h-2 w-2 rounded-full bg-white/90" />
              </span>

              <span className="btn-label overflow-hidden leading-none">
                <span data-split="btn-label" className="block">
                  Technology
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* SCROLL */}
      <div className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-2 text-xs tracking-wide text-white/80">
        <span className="select-none">scroll to explore the mission</span>
        <svg
          data-anim="chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-90"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}