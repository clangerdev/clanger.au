import Link from "next/link";
import { Trophy, Users, Zap, DollarSign, Target, Shield } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Users,
    title: "Pick Your Contest",
    description:
      "Browse our lobby and find the perfect contest. Choose from NFL, NBA, MLB, and NHL across various entry fees and prize pools.",
  },
  {
    icon: Target,
    title: "Build Your Lineup",
    description:
      "Select your players within the salary cap or make your picks. Use our projections and stats to make informed decisions.",
  },
  {
    icon: Zap,
    title: "Watch & Win",
    description:
      "Follow along with live scoring as your players rack up points. Climb the leaderboard and cash out when you finish in the money.",
  },
];

const features = [
  {
    icon: Trophy,
    title: "Guaranteed Prizes",
    description:
      "Most contests have guaranteed prize pools that pay out regardless of how many entries.",
  },
  {
    icon: DollarSign,
    title: "Instant Withdrawals",
    description:
      "Cash out your winnings instantly. No waiting periods or hidden fees.",
  },
  {
    icon: Shield,
    title: "Fair Play Guaranteed",
    description:
      "Advanced anti-fraud systems ensure a level playing field for all players.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="py-16">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold font-display mb-4">
              How <span className="text-gradient-orange">Clanger</span> Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Get in the game in three simple steps. No long-term commitments,
              just pure fantasy sports action.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold font-display text-center mb-8">
              Why Choose Clanger?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of players already winning on Clanger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">Create Free Account</Button>
              </Link>
              <Link href="/lobby">
                <Button size="lg" variant="outline">
                  Browse Contests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
