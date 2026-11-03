// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'

/**
 * The server configuration, as a test rather than an assumption.
 *
 * `build/Caddyfile` is not only configuration: the build copies it into
 * `dist/static/Caddyfile`, the deploy puts it in the web root, and the Caddy on
 * the VPS imports `/srv/<site>/Caddyfile`. What is written here is what production
 * runs, and neither a compiler nor a linter checks it.
 *
 * Every assertion below is a failure that is silent:
 *
 * - `hide Caddyfile` with a leading slash validates and does nothing, because
 *   `hide` matches on file name — the whole configuration, comments included,
 *   was fetchable on `GET /Caddyfile`.
 * - A `@hashed` class without `-` in it. Rolldown hashes in base64url, so the
 *   hash contains `-` and `_`; a class without them exempts exactly those files
 *   from `immutable`, which is the only thing that rule exists for.
 * - The security snippet is imported twice, once per route. That is not a
 *   duplicate: `handle_errors` does not inherit the site-level `header`.
 */

const read = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), 'utf8')

/**
 * The configuration without its comments.
 *
 * Every assertion below counts directives, and the comments name them: the note
 * about `hide` mentions `hide` itself. Counting on the raw text lets the prose
 * count as configuration, and then a test passes for the wrong reason.
 */
function directives(config: string): string {
  return config
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'))
    .join('\n')
}

const FILES = ['build/Caddyfile', 'build/Caddyfile.preview']

const HEADERS = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'X-Frame-Options',
  'Permissions-Policy'
]

describe('the configuration is not fetchable', () => {
  it.each(FILES)('hides the file in %s', async (path) => {
    const config = directives(await read(path))

    expect(config).toContain('hide Caddyfile')
    // `hide /Caddyfile` validates and then does nothing. This assertion exists
    // because that failure is silent.
    expect(config).not.toContain('hide /Caddyfile')
  })

  it.each(FILES)('hides it in every file_server, not one', async (path) => {
    const config = directives(await read(path))
    const servers = config.split('file_server').length - 1
    const hides = config.split('hide Caddyfile').length - 1

    // Production has three (`handle_path /*`, `handle /`, `handle_errors`) and
    // the preview two. Counting hides against servers keeps this true if a route
    // is added later.
    expect(servers).toBeGreaterThanOrEqual(2)
    expect(hides).toBe(servers)
  })
})

describe('the security headers survive on the error route', () => {
  it('defines each field exactly once', async () => {
    const config = directives(await read('build/Caddyfile'))

    for (const header of HEADERS) {
      // Two definitions of one field means the last one wins, or that a response
      // carries it twice. Neither is visible in the file itself.
      expect(config.split(header).length - 1, header).toBe(1)
    }
  })

  it('imports the snippet once per route', async () => {
    const config = directives(await read('build/Caddyfile'))
    const imports = config.split('import SimsustechSecurityHeaders').length - 1

    // One import is the tempting clean-up, and it costs the headers on every
    // 404 — measured: 0 of 5, `Server: Caddy` back.
    expect(imports).toBe(2)
  })

  it('names the snippet after the site, not after its purpose', async () => {
    // Every site file on the VPS shares one snippet namespace; two sites with the
    // same snippet name make Caddy drop one and silently share the other's.
    expect(directives(await read('build/Caddyfile'))).toContain(
      '(SimsustechSecurityHeaders) {'
    )
  })
})

describe('the cache rules follow the names the bundler makes', () => {
  it.each(FILES)('matches a base64url hash in %s', async (path) => {
    const config = directives(await read(path))

    expect(config).toContain('immutable')
    // `-` belongs in the class, and exactly eight characters: an open-ended
    // class also matches `server-renderer.mjs` and pins a changing file for a
    // year.
    expect(config).toContain('@hashed path_regexp hashed -[A-Za-z0-9_-]{8}\\.')
  })

  it.each(FILES)('keeps no net for unhashed chunks in %s', async (path) => {
    const config = directives(await read(path))

    // Since vitrify 0.32.0 every client chunk is `name-<hash>.mjs`, so a
    // `no-cache` net matches none of them. If it reappears, it does so because
    // someone restored the old assumption.
    expect(config).not.toContain('@stale')
    expect(config).not.toContain('Cache-Control "no-cache"')
  })
})

describe('the error page exists as a file', () => {
  it.each(FILES)('rewrites a 404 to /404.html in %s', async (path) => {
    // The rewrite is half of it; the other half is the explicit `404` route in
    // the router, which is what makes the prerenderer write the file.
    expect(directives(await read(path))).toContain(
      'rewrite @notFound /404.html'
    )
  })
})
