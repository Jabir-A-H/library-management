
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * App-wide toast notification provider using Sonner and next-themes.
 *
 * @param {object} props - Props passed to Sonner's Toaster
 * @returns {JSX.Element}
 */
export function Toaster(props) {
  const { theme = "system" } = useTheme();
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
}
