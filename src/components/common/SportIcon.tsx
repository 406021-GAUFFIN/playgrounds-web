interface SportIconProps {
  pictogram: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SportIcon = ({
  pictogram,
  className = "",
  style = {},
}: SportIconProps) => {
  if (!pictogram) return null;

  const processedHtml = pictogram
    .replace(/<svg/i, '<svg width="100%" height="100%"')
    .replace(/fill="([^"]*)"/gi, (match, p1) =>
      p1.toLowerCase() === "none" ? match : 'fill="currentColor"'
    )
    .replace(/fill:([^;"]+)/gi, (match, p1) =>
      p1.toLowerCase() === "none" ? match : "fill:currentColor"
    );

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      dangerouslySetInnerHTML={{
        __html: processedHtml,
      }}
    />
  );
};
