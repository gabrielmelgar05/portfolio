import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type PreloaderProps = {
  onDone: () => void;
};

export function Preloader({ onDone }: PreloaderProps) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scope.current;
    if (!container) return;

    let logoSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      const run = async () => {
        try {
          await document.fonts?.ready;
        } catch {
            //
        }

        const logoEl = container.querySelector("[data-preloader-logo]") as HTMLElement | null;
        if (!logoEl) return;

        // Split em chars pra efeito "digitando"
        logoSplit = SplitText.create(logoEl, {
          type: "chars",
          charsClass: "char",
        });

        // estado inicial: chars fora da tela à direita + invisíveis
        gsap.set(logoSplit.chars, { xPercent: 120, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
        });

        // 1) digitação
        tl.to(logoSplit.chars, {
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.06,
        });

        // 2) pequena pausa
        tl.to({}, { duration: 0.4 });

        // 3) mover logo até a navbar
        tl.add(async () => {
          const navLogo = document.querySelector("[data-logo='nav']") as HTMLElement | null;
          if (!navLogo || !logoEl) return;

          // pegar posições
          const fromRect = logoEl.getBoundingClientRect();
          const toRect = navLogo.getBoundingClientRect();

          // transformar logo central em absolute relativamente ao viewport
          const startX = fromRect.left;
          const startY = fromRect.top;
          const width = fromRect.width;
          const height = fromRect.height;

          // “destacar” o logo do fluxo
          gsap.set(logoEl, {
            position: "fixed",
            left: startX,
            top: startY,
            width,
            height,
            margin: 0,
            transformOrigin: "left center",
          });

          const dx = toRect.left - startX;
          const dy = toRect.top - startY;
          const scale = toRect.width / width;

          // anima deslocamento + scale
          gsap.to(logoEl, {
            x: dx,
            y: dy,
            scale,
            duration: 1.2,
            ease: "power3.inOut",
          });
        });

        // 4) fade-out do fundo preto e remover preloader
        tl.to(
          container,
          {
            backgroundColor: "rgba(0,0,0,0)",
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.7"
        ).to(
          container,
          {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: onDone,
          },
          "-=0.2"
        );
      };

      run();
    }, scope);

    return () => {
      ctx.revert();
      logoSplit?.revert();
    };
  }, [onDone]);

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
    >
      <h1
        data-preloader-logo
        className='text-[40px] tracking-[0.35em] uppercase [font-family:Nevera,system-ui,sans-serif]'
      >
        ARTEMIS
      </h1>
    </div>
  );
}