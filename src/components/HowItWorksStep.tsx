interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorksStep = ({ step, title, description, icon }: HowItWorksStepProps) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step number */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-magic to-sparkle text-xs font-bold text-white shadow-magic">
        {step}
      </div>
      
      {/* Icon container */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-card border border-white/10 bg-gradient-to-br from-magic/15 to-sparkle/15 text-magic">
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
};

export default HowItWorksStep;
