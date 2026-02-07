interface StatsCardProps {
  value: string;
  label: string;
  sublabel?: string;
}

const StatsCard = ({ value, label, sublabel }: StatsCardProps) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-gradient md:text-5xl">{value}</div>
      <div className="mt-2 text-base font-medium text-foreground">{label}</div>
      {sublabel && (
        <div className="mt-1 text-sm text-muted-foreground">{sublabel}</div>
      )}
    </div>
  );
};

export default StatsCard;
