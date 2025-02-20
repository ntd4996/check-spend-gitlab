import {
  ClockIcon,
  TicketIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface Props {
  title: string;
  value: string | number | [string, string];
  description?: string | string[];
  type: "time" | "tickets" | "average" | "income";
}

export const StatsCard = ({ title, value, description, type }: Props) => {
  const getIcon = () => {
    switch (type) {
      case "time":
        return <ClockIcon className="w-5 h-5" />;
      case "tickets":
        return <TicketIcon className="w-5 h-5" />;
      case "average":
        return <ChartBarIcon className="w-5 h-5" />;
      case "income":
        return <CurrencyDollarIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const renderValue = () => {
    if (Array.isArray(value) && type === "income") {
      const [usd, vnd] = value;
      return (
        <div className="flex flex-col">
          <span>{usd}</span>
          <span className="text-base opacity-75 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            ≈ {vnd}đ
          </span>
        </div>
      );
    }
    return value;
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
      <div className="flex items-center gap-2 text-dark-400">
        {getIcon()}
        <span>{title}</span>
      </div>
      <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        {renderValue()}
      </div>
      {description && (
        <div className="mt-1 text-sm text-dark-400 flex flex-col gap-1">
          {Array.isArray(description) ? (
            <>
              <span>{description[0]}</span>
              <span className="text-xs opacity-75">{description[1]}</span>
            </>
          ) : (
            description
          )}
        </div>
      )}
    </div>
  );
};
