import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getAQIStyles = (value) => {
  if (value <= 50) return "bg-[rgba(34,197,94,0.25)]";
  if (value <= 100) return "bg-[rgba(250,204,21,0.25)]";
  if (value <= 150) return "bg-[rgba(251,146,60,0.25)]";
  if (value <= 200) return "bg-[rgba(239,68,68,0.25)]";
  return "bg-[rgba(153,27,27,0.35)]";
};

const getAQILabel = (value) => {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy (Sensitive)";
  if (value <= 200) return "Unhealthy";
  return "Very Unhealthy";
};

const AQIBadge = ({ value }) => {
  return (
    <div
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2",
        "text-white", // ✅ ALWAYS WHITE
        getAQIStyles(value)
      )}
    >
      <span>{value}</span>
      <span className="opacity-80">{getAQILabel(value)}</span>
    </div>
  );
};

export default AQIBadge;
