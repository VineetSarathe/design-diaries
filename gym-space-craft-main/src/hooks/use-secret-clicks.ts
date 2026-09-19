import { useRef } from "react";

type ClickEvent = {
  preventDefault: () => void;
};

export function useSecretClicks(
  onUnlock: () => void,
  { clicks = 3, windowMs = 800 }: { clicks?: number; windowMs?: number } = {},
) {
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  return (event: ClickEvent) => {
    count.current += 1;
    if (timer.current) clearTimeout(timer.current);

    if (count.current >= clicks) {
      event.preventDefault();
      count.current = 0;
      onUnlockRef.current();
      return;
    }

    timer.current = setTimeout(() => {
      count.current = 0;
    }, windowMs);
  };
}
