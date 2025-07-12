import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine class names conditionally and merge Tailwind classes.
 *
 * This function is a wrapper around `clsx` and `tailwind-merge`.
 * It is used throughout the project to ensure that className props are
 * composed in a readable, maintainable, and editor-friendly way.
 *
 * @param {...any[]} inputs - Any number of class name values (strings, arrays, objects, etc.)
 * @returns {string} - The merged class name string
 *
 * @example
 *   cn('p-2', condition && 'bg-red-500', ['text-lg', anotherClass])
 */
export function cn(...inputs: any[]): string {
  return twMerge(clsx(...inputs));
}

