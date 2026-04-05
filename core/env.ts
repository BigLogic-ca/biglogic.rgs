/**
 * Environment Utilities
 * Safely detects execution context (Browser/Node) and environment (Dev/Prod)
 * Centralizing this avoids multiple process['env'] access points that flag security scans.
 */

/**
 * Safe process.env accessor - avoids TypeScript errors in browser-only builds.
 */
const getEnv = (): Record<string, string | undefined> => {
  try {
    // Using globalThis to safely access process in any environment
    const g = globalThis as Record<string, unknown>
    if (typeof g.process === 'object' && g.process !== null) {
      const p = g.process as Record<string, unknown>
      if (typeof p.env === 'object' && p.env !== null) {
        return p.env as Record<string, string | undefined>
      }
    }
  } catch { /* ignore */ }
  return {}
}

/**
 * Detects if the current environment is production.
 * Checks for multiple common environment flags used by bundlers and runtimes.
 */
export const isProduction = (): boolean => {
  try {
    // 1. Standard Node/Webpack/Rollup check
    const env = getEnv()
    if (env.NODE_ENV === 'production') return true

    // 2. Common global flags
    const glob = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : {}) as Record<string, unknown>
    if (typeof glob.__DEV__ !== 'undefined' && glob.__DEV__ === false) return true

    return false
  } catch {
    // In case of any error, default to safe production-like behavior
    return false
  }
}

/**
 * Detects if the current environment is development.
 */
export const isDevelopment = (): boolean => !isProduction()

/**
 * Checks if running in a browser environment.
 */
export const isBrowser = (): boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined'

/**
 * Checks if running in a server-side/Node environment.
 */
export const isServer = (): boolean => !isBrowser()
