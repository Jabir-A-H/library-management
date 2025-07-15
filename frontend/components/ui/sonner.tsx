import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * App-wide toast notification provider using Sonner and next-themes.
 * Wraps Sonner's Toaster and applies theme and custom CSS variables.
 *
 * @param {ToasterProps} props - Props passed to Sonner's Toaster
 * @returns {JSX.Element}
 *
 * @example
 * <Toaster position="top-right" richColors closeButton />
 */
export function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties & Record<string, any>
      }
      {...props}
    />
  );
}
