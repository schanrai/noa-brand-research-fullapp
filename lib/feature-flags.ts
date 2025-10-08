/**
 * Feature Flags
 * 
 * Centralized feature flag system to control UI/UX behavior across the app.
 * This allows us to toggle features without deleting code, making it easy to
 * enable/disable functionality for different deployment modes.
 */

/**
 * Report-Only Mode
 * 
 * When enabled:
 * - Hides all CRM-related UI (sidebars, action buttons)
 * - Focuses on brand research and PDF export
 * - No data persistence or CRM operations
 * 
 * Set to `true` for standalone report-only deployment
 * Set to `false` to restore full CRM functionality
 */
export function isReportOnlyMode(): boolean {
  // Check environment variable first (for deployment flexibility)
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_REPORT_ONLY_MODE) {
    return process.env.NEXT_PUBLIC_REPORT_ONLY_MODE === 'true'
  }
  
  // Default: Report-only mode is ENABLED for this deployment
  return true
}

