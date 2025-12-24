import Image from "next/image";
import logo from "@/assets/clanger-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Clanger"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-display text-xl font-bold">Clanger</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Responsible Play
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 Clanger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
