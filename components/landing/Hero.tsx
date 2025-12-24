import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background-elevated" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-4 animate-slide-up">
            <Image
              src="/clanger-logo.png"
              alt="Clanger mascot"
              width={160}
              height={160}
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Brand Name */}
          <h2
            className="font-display text-4xl md:text-6xl font-black tracking-tight mb-6 animate-slide-up text-gradient-orange"
            style={{ animationDelay: "0.05s" }}
          >
            CLANGER
          </h2>

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
              Now Live
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Fantasy Sports
            <span className="block text-primary">Redefined</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            Compete in leagues, build your dream roster, and win big with
            Clanger. The fastest, most exciting way to play fantasy.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              asChild
              size="lg"
              className="group px-8 py-6 text-lg font-bold glow-orange"
            >
              <Link href="/lobby">
                <Zap className="mr-2 h-5 w-5" />
                Start Playing
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-muted hover:bg-card hover:border-primary/50"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-3 gap-8 md:gap-16 mt-16 pt-16 border-t border-border/50 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">
                $10M+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Prizes Won</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                250K+
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Players
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                Live
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                24/7 Contests
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
