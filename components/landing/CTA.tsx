import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-elevated to-background" />
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-secondary">Dominate?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of players already winning on Clanger. 
            Your next championship starts now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group px-8 py-6 text-lg font-bold glow-orange">
              <Download className="mr-2 h-5 w-5" />
              Download App
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold border-secondary/50 text-secondary hover:bg-secondary/10 hover:border-secondary">
              Play on Web
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Licensed & Regulated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Instant Withdrawals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
