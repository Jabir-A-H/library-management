
import * as React from "react";

/**
 * @typedef SidebarContextValue
 * @property {string} state - "expanded" or "collapsed"
 * @property {boolean} open
 * @property {function} setOpen
 * @property {boolean} isMobile
 * @property {boolean} openMobile
 * @property {function} setOpenMobile
 * @property {function} toggleSidebar
 */

/**
 * Sidebar context for managing sidebar state and actions.
 * @type {React.Context<SidebarContextValue|null>}
 */
export const SidebarContext = React.createContext(null);

/**
 * Custom hook to access sidebar context.
 * Throws if used outside a SidebarProvider.
 *
 * @returns {SidebarContextValue}
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
