import { Sport } from "@/app/spaces/_types";
import { SportIcon } from "./SportIcon";

interface SportBadgeProps {
  sport: Sport;
}

export const SportBadge = ({ sport }: SportBadgeProps) => {
  return (
    <div className="flex items-center gap-2 surface-ground px-3 py-1 border-round-2xl border-1 surface-border">
      {sport.pictogram && (
        <SportIcon
          pictogram={sport.pictogram}
          className="w-1rem h-1rem text-color"
        />
      )}
      <span className="text-color text-sm font-medium">{sport.name}</span>
    </div>
  );
};
