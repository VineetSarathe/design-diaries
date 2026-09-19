import type { MouseEvent, PointerEvent } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoPlayButton({
  playing,
  label,
  onToggle,
  className,
}: {
  playing: boolean;
  label: string;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const stopBubble = (event: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={stopBubble}
      onMouseDown={stopBubble}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(event);
      }}
      className={cn(
        "pointer-events-auto absolute top-1/2 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-background/70 bg-foreground/45 text-background backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    >
      {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
    </button>
  );
}
