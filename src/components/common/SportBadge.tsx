import { Sport } from "@/app/spaces/_types";

interface SportBadgeProps {
  sport: Sport;
}

export const SportBadge = ({ sport }: SportBadgeProps) => {
  return (
    <div className="flex items-center gap-2 surface-ground px-3 py-1 border-round-2xl border-1 surface-border">
      {sport.pictogram && (
        <div
          className="w-1rem h-1rem text-color"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{
            __html: sport.pictogram
              .replace(/<svg/i, '<svg width="100%" height="100%"')
              .replace(/fill="([^"]*)"/gi, (match, p1) =>
                p1.toLowerCase() === "none" ? match : 'fill="currentColor"'
              )
              .replace(/fill:([^;"]+)/gi, (match, p1) =>
                p1.toLowerCase() === "none" ? match : "fill:currentColor"
              ),
          }}
        />
      )}
      <span className="text-color text-sm font-medium">{sport.name}</span>
    </div>
  );
};
