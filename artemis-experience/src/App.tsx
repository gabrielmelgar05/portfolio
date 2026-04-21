import { useState } from "react";
import { HeroSection } from "./sections/HeroSection";
import { Preloader } from "./sections/Preloader";

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Hero sempre está por baixo */}
      <HeroSection />

      {/* Preloader por cima, some quando animação acaba */}
      {!isLoaded && <Preloader onDone={() => setIsLoaded(true)} />}
    </div>
  );
}