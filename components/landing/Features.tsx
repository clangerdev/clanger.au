import { Trophy, Users, Zap, TrendingUp, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Contests",
    description: "Jump into live contests instantly. No waiting, just action.",
    accent: "primary" as const,
  },
  {
    icon: Trophy,
    title: "Massive Payouts",
    description: "Win big with guaranteed prize pools every single day.",
    accent: "secondary" as const,
  },
  {
    icon: Users,
    title: "League Play",
    description: "Create private leagues and compete with friends all season.",
    accent: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Live Scoring",
    description: "Real-time updates so you never miss a moment of action.",
    accent: "secondary" as const,
  },
  {
    icon: Shield,
    title: "Fair Play",
    description: "Advanced anti-collusion tech keeps competition honest.",
    accent: "primary" as const,
  },
  {
    icon: Clock,
    title: "Best Ball",
    description: "Set it and forget it. Auto-optimized lineups for busy pros.",
    accent: "secondary" as const,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background-elevated">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Built for <span className="text-primary">Winners</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every feature designed to give you the edge you need to dominate.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  feature.accent === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
