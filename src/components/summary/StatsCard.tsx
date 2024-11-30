interface StatsCardProps {
  value: string | number;
  label: string;
  reversed?: boolean;
}

export const StatsCard = ({ value, label, reversed }: StatsCardProps) => (
  <div className="text-center space-y-2 bg-secondary-button bg-opacity-40 rounded-lg p-4 max-w-md">
    {reversed ? (
      <>
        <h5>{label}</h5>
        <h2 className="text-secondary">{value}</h2>
      </>
    ) : (
      <>
        <h2 className="text-secondary">{value}</h2>
        <h5>{label}</h5>
      </>
    )}
  </div>
);
