import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export function HeroSection() {
  const scope = useRef<HTMLElement>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!scope.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-anim='nav']", { y: -16, opacity: 0, duration: 0.7 })
        .from("[data-anim='title']", { y: 70, opacity: 0, duration: 0.9 }, "-=0.25")
        .from("[data-anim='subtitle']", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
        .fromTo(
            "[data-anim='cta']",
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
            "-=0.4"
        )
        .from("[data-anim='scroll']", { y: 10, opacity: 0, duration: 0.6 }, "-=0.25");

      gsap.to("[data-anim='chevron']", {
        y: 6,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, scope);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={scope}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      {/* Background image */}
      <img
        src="/image-hero.png"
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay gradient (0% -> 50% -> 100%) */}
      <div
        className="absolute inset-0 pointer-events-none
        bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,1)_100%)]"
      />

      {/* Optional top gradient for navbar legibility */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-black/60 to-black/0" />

      {/* NAVBAR (absolute pra não somar altura e criar scroll) */}
      <header data-anim="nav" className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
          <div className='text-lg tracking-[0.35em] uppercase text-white/90 [font-family:Nevera,system-ui,sans-serif]'>
            ARTEMIS
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/85 md:flex">
            <a className="transition hover:text-white" href="#mission">
              Mission
            </a>
            <a className="transition hover:text-white" href="#astronauts">
              Astronauts
            </a>
            <a className="transition hover:text-white" href="#technology">
              Technology
            </a>
          </nav>
        </div>
      </header>

      {/* CENTER CONTENT (ocupa a hero inteira sem empurrar nada pra baixo) */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center">
          <h1
            data-anim="title"
            className='text-[56px] leading-none tracking-[0.04em] text-white sm:text-[72px] md:text-[126px]
            [font-family:Nevera,system-ui,sans-serif]'
          >
            ARTEMIS II
          </h1>

          <p
            data-anim="subtitle"
            className="mx-auto mt-2 max-w-2xl text-base text-white/85 sm:text-lg md:text-[26px]"
          >
            Humanity&apos;s return to the Moon has begun.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              data-anim="cta"
              href="#mission"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-black
                         shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition hover:bg-white/95 active:scale-[0.99]"
            >
              Explore the Mission
            </a>

            <a
              data-anim="cta"
              href="#technology"
              className="inline-flex items-center justify-center rounded-lg bg-white/20 px-5 py-3 text-sm font-medium text-white
                         backdrop-blur-sm transition hover:bg-white/25 active:scale-[0.99]"
            >
              Technology
            </a>
          </div>
        </div>
      </div>

      {/* SCROLL CUE */}
      <div
        data-anim="scroll"
        className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-2 text-xs tracking-wide text-white/80"
      >
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