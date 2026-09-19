const names = [
  "IRON STANDARD",
  "PULSE ATHLETIC CLUB",
  "THE MOVEMENT ROOM",
  "FORGE 24",
  "SANCTUM WELLNESS",
  "REP HOUSE",
  "ALTITUDE FITNESS",
  "CORE COLLECTIVE",
];

export function Marquee() {
  const row = [...names, ...names];
  return (
    <div className="group overflow-hidden border-y border-border py-6">
      <div className="marquee-track gap-16 group-hover:[animation-play-state:paused]">
        {row.map((n, i) => (
          <span
            key={`${n}-${i}`}
            className="label-caps shrink-0 text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
