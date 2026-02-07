interface GlowingDividerProps {
  variant?: "magic" | "sparkle" | "dual";
  className?: string;
}

const GlowingDivider = ({ variant = "dual", className = "" }: GlowingDividerProps) => {
  const gradients = {
    magic: "from-transparent via-magic/60 to-transparent",
    sparkle: "from-transparent via-sparkle/60 to-transparent",
    dual: "from-magic/40 via-sparkle/50 to-magic/40",
  };

  const glows = {
    magic: "shadow-[0_0_30px_hsl(280_60%_55%/0.5)]",
    sparkle: "shadow-[0_0_30px_hsl(40_95%_55%/0.5)]",
    dual: "shadow-[0_0_40px_hsl(280_60%_55%/0.4),0_0_60px_hsl(40_95%_55%/0.3)]",
  };

  return (
    <div className={`relative py-1 ${className}`}>
      <div
        className={`h-px bg-gradient-to-r ${gradients[variant]} ${glows[variant]}`}
      />
      {/* Center glow accent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`w-24 h-1 rounded-full bg-gradient-to-r ${gradients[variant]} blur-sm ${glows[variant]}`} />
      </div>
    </div>
  );
};

export default GlowingDivider;
