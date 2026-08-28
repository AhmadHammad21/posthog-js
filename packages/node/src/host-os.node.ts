import { platform, release } from 'node:os'

/**
 * OTLP `os.name` / `os.version` for the machine running the SDK, so spans can
 * be filtered by platform (e.g. "only the Linux workers") in PostHog.
 *
 * Node-only, like the other `.node` modules: the edge build has no `node:os`,
 * and importing it from a shared module puts it in the edge bundle. A runtime
 * that shims `node:os` only partially can still throw, so a failed read omits
 * the key rather than throwing out of client construction.
 */
export function hostOsResourceAttributes(): Record<string, string> {
  let osName: string | undefined
  let osVersion: string | undefined
  try {
    osName = platform()
    osVersion = release()
  } catch {
    // leave both unset
  }
  return {
    ...(osName ? { 'os.name': osName } : {}),
    ...(osVersion ? { 'os.version': osVersion } : {}),
  }
}
