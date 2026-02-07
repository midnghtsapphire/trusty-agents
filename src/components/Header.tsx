import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-magic to-sparkle shadow-magic">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Poof<span className="text-gradient">Agent</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#agents" className="text-sm font-semibold text-foreground/80 hover:text-sparkle transition-colors">
            Agents
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-foreground/80 hover:text-sparkle transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm font-semibold text-foreground/80 hover:text-sparkle transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-sm font-semibold text-foreground/80 hover:text-sparkle transition-colors">
            About
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="magic" size="sm">
            <Sparkles size={16} />
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border glass md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 p-4">
            <a href="#agents" className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              Agents
            </a>
            <a href="#how-it-works" className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              About
            </a>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="ghost" className="w-full">
                Sign In
              </Button>
              <Button variant="magic" className="w-full">
                <Sparkles size={16} />
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
