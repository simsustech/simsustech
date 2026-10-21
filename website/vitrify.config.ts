import type { VitrifyConfig, VitrifyConfigAsync } from 'vitrify'
import { QuasarPlugin, type QuasarPluginOptions } from 'vitrify/plugins'
import type { QuasarIconSet } from 'quasar'
// `QuasarPreset` is exported by the preset, NOT by vitrify. Importing it from
// 'vitrify' fails at load time ("does not provide an export named
// 'QuasarPreset'"), and since 0.7 the preset also refuses to run without a
// style, so both the import and `style` below are required.
import { QuasarPreset, quasarIconSet } from 'unocss-preset-quasar'
import { MaterialDesign3 } from 'unocss-preset-quasar/styles'
import { certificateFor } from 'devcert'
import { plugin as mdPlugin } from 'vite-plugin-markdown'
import { Mode } from 'vite-plugin-markdown'
import { copyFile } from 'fs/promises'
import { ssgSitemap } from '@simple-site-generator/templates/seo'
import { ssgUnoConfig } from '@simple-site-generator/templates/design'
import type { SeoBusiness, SiteExtra } from '@simple-site-generator/templates'

interface SimpleSiteGenerator {
  ssg: {
    title: string
    url: string
    template: string
    favicon: string
    lang: string
    description: string
    sourceColor: string
    tags: Record<string, { label: string }>
    extra?: SiteExtra
    jsonLd?: { business?: SeoBusiness }
  }
}

/**
 * Site identity.
 *
 * `url` MUST be an absolute origin with a scheme: the SEO layer builds the
 * canonical tag, the OpenGraph URL, the sitemap `<loc>` and the JSON-LD `@id`
 * from it, and `ssg verify` rejects a canonical that is not absolute. The
 * Caddyfile that is copied into the build keeps its own host name, because it
 * needs a bare host, not a URL.
 */
const ssg = {
  title: 'simsustech',
  url: 'https://www.simsus.tech',
  favicon: '/favicon-96.png',
  // Selects which template module `virtual:ssg:template` imports.
  template: 'business',
  templatePackage: '@simple-site-generator/templates',
  description:
    'simsustech builds simple, sustainable websites and web applications for professionals — Vue, Quasar and Fastify, statically generated.',
  // BCP-47 tag for og:locale, JSON-LD `inLanguage`, and — through
  // `vitrify.lang` below — the `<html lang>` that Quasar writes. It must be one
  // of Quasar's language packs (node_modules/quasar/lang), e.g. `en-GB`, `nl`,
  // `de`; a bare `en` has no pack and Quasar silently falls back to `en-US`,
  // which then disagrees with og:locale.
  lang: 'en-GB',
  // The only colour input. MD3 derives its whole tonal palette — every role
  // token the design system reads, in light and dark mode — from this one value.
  // There is no `colors` map beside it any more: it produced utilities that
  // drifted from the templates' own tokens, so the design system dropped it.
  sourceColor: '#22c92a',
  tags: {
    menu: {
      label: 'Menu'
    },
    footer: {
      label: 'Footer'
    },
    contact: {
      label: 'Contact'
    }
  },
  // Business facts that are not per-page. Everything here is either visible on
  // the Contact page or a registered company detail; nothing is invented.
  extra: {
    email: 'info@simsus.tech',
    // KvK (Dutch chamber of commerce) number; also shown on the Contact page.
    registration: '83537813'
  } satisfies SiteExtra,
  jsonLd: {
    business: {
      type: 'Organization',
      name: 'simsustech',
      description:
        'simsustech develops simple, sustainable websites and web applications for professionals.',
      email: 'info@simsus.tech'
    } satisfies SeoBusiness
  }
}

const { template, templatePackage, title } = ssg

/**
 * Roboto, self-hosted.
 *
 * The package manager fetches the files and Vite bundles them, so the browser
 * only ever asks this site's own Caddy for a font — one connection fewer than a
 * font CDN, no third party in the request log, and nothing to consent to.
 *
 * The family is named `Roboto`, not the package's `Roboto Variable`, because the
 * design system's typography tokens name Roboto literally; renaming the family
 * here would mean changing those tokens for one app's choice of file source.
 *
 * Only two subsets are declared: the package's `index.css` also carries
 * Cyrillic, Greek and Vietnamese, which would add ~150 KB of glyphs this site
 * can never render — and a preload for one of them is what the browser was
 * warning about.
 */
const selfHostedFonts = {
  getCSS: () => `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2') format('woff2-variations');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('@fontsource-variable/roboto/files/roboto-latin-ext-wght-normal.woff2') format('woff2-variations');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
`
}

/**
 * Quasar's internal icons, resolved to iconify classes.
 *
 * Handing Quasar the library *name* lets it pick its own font classes
 * (`mdi mdi-menu-down`), and this app loads no icon font — so every icon the
 * framework draws itself (the dropdown arrow, a select's chevron, a table's
 * expander) rendered as nothing.
 *
 * The rewritten *set* is what fixes that: each value is already a class the
 * preset emits CSS for, and QIcon applies it directly. The resolution's
 * `iconMapFn` is deliberately not passed: Vitrify serialises the Quasar config
 * into the client bundle, and a function does not survive that trip — the arrow
 * threw `toClass is not defined` instead of rendering. The cost of the set is
 * real (about 5 KB gzipped) and worth it here; bare icon names would need the
 * mapper, and this app always writes full `i-mdi-*` names.
 */
const icons = quasarIconSet('mdi-v7')

const quasarConf: QuasarPluginOptions = {
  framework: {
    components: [],
    // 'Meta' is what makes Quasar emit the per-page <title>, description,
    // canonical, OpenGraph and JSON-LD tags. Without it `ssrContext._meta.headTags`
    // stays empty and a prerendered page ships no metadata at all.
    // Only `Meta` is used. The template ships Dialog/Notify/Loading by default,
    // but this site opens no dialogs, toasts or loading overlays, and each
    // plugin is real JavaScript in the shared chunk — dropping the three of
    // them is what keeps the gzipped transfer inside the 250 KB budget.
    plugins: ['Meta'],
    // The rewritten set, so the icons Quasar draws itself exist. The preset
    // types it as `unknown` — it is a nested map of strings, and pinning it to
    // Quasar's own type would tie the preset to a Quasar version — so the
    // assertion belongs here, at the one place that needs the real type.
    iconSet: icons.iconSet as QuasarIconSet
  },
  disableSass: true
}

export default async function ({
  mode
}: Parameters<VitrifyConfigAsync>[0]): Promise<VitrifyConfig> {
  const config: VitrifyConfig & SimpleSiteGenerator = {
    optimizeDeps: {
      exclude: ['@simple-site-generator/templates']
    },
    plugins: [
      mdPlugin({
        mode: [Mode.HTML]
      }),
      // Emits sitemap.xml and robots.txt into dist/static, generated from the
      // same page frontmatter the router reads. This replaces the old
      // `generateSitemap.mjs` script, which scanned dist/static instead.
      ssgSitemap({
        site: {
          title: ssg.title,
          url: ssg.url,
          description: ssg.description,
          favicon: ssg.favicon,
          lang: ssg.lang,
          extra: ssg.extra,
          jsonLd: ssg.jsonLd
        },
        pagesDir: new URL('./src/pages', import.meta.url).pathname,
        distDir: new URL('./dist', import.meta.url).pathname
      }),
      {
        name: 'simple-site-generator-plugin',
        resolveId(id: string) {
          if (id === 'virtual:ssg:template' || id === 'virtual:ssg:site') {
            return `\0${id}`
          }
        },
        load(id: string) {
          if (id === '\0virtual:ssg:template') {
            return `import * as template from '${templatePackage}/${template}';
              export * from '${templatePackage}/${template}';
              export default template;`
          }
          if (id === '\0virtual:ssg:site') {
            // ONLY the identity the browser needs. Importing
            // `virtual:vitrify-config` inlined the whole build config
            // (including the icon map) into the client bundle.
            return `export const site = ${JSON.stringify({
              title: ssg.title,
              url: ssg.url,
              description: ssg.description,
              favicon: ssg.favicon,
              lang: ssg.lang,
              template: ssg.template,
              templatePackage: ssg.templatePackage,
              tags: ssg.tags,
              extra: ssg.extra,
              jsonLd: ssg.jsonLd
            })};`
          }
        },
        closeBundle: () => {
          copyFile(
            new URL('./build/Caddyfile', import.meta.url).pathname,
            new URL(`./dist/static/Caddyfile`, import.meta.url).pathname
          )
        }
      }
    ],
    ssg,
    vitrify: {
      // Registering the Quasar plugin is what makes `useQuasar()` and every
      // `q-*` component work during SSR. Without it a prerendered page throws
      // "Cannot read properties of undefined (reading 'screen')" and ships an
      // empty <div id="app">.
      plugins: [
        {
          plugin: QuasarPlugin,
          options: quasarConf
        }
      ],
      productName: title,
      // Pass the BCP-47 tag to Quasar as well: Quasar writes `<html lang>`
      // from its selected language pack, and vitrify forwards this value to it.
      lang: ssg.lang,

      // Analytics, injected into the prerendered HTML at build time rather than
      // appended by a script in `index.html`. An empty id ships no tag at all,
      // so a preview build and the verifier's localhost run cannot post into
      // production numbers.
      analytics: {
        umami: {
          websiteId: 'd0869a2d-f683-4b59-8ebf-f864acfa7af5',
          // The public origin, not the dashboard host: the dashboard is only
          // reachable over netbird, over http, on a name no visitor resolves.
          host: 'stats.simsus.tech',
          // Umami renames its loader to dodge ad-blocker blocklists, and the
          // rename has to match TRACKER_SCRIPT_NAME and UMAMI_DOMAIN in the
          // Umami stack on the VPS.
          scriptName: 's.js',
          domains: ['simsus.tech', 'www.simsus.tech'],
          doNotTrack: true
        }
      },
      hooks: {
        onSetup: [new URL('src/setup.ts', import.meta.url)]
      },
      unocss: {
        presets: [
          QuasarPreset({
            style: MaterialDesign3,
            sourceColor: ssg.sourceColor,
            plugins: quasarConf.framework.plugins,
            iconSet: 'mdi-v7',
            // Declaring an app extension is what ports its selectors into this
            // app's CSS: the entry names a *style*, not a component.
            //
            // `qmarkdown` is deliberately absent. The prose is styled by the
            // design system itself (`ssg-prose`), and its ported stylesheet was
            // ~10 KB that changed one rendered property — the link underline,
            // which now lives in the design system. Nothing on the site uses
            // code blocks or tables, which is what most of it styled.
            appExtensions: ['qmediaplayer'],
            // The preset's default fetches Roboto from a font CDN and preloads
            // subsets this site never uses — the console warned about a
            // Cyrillic file being preloaded and unused. `provider: 'none'`
            // keeps the font name and the family variable, and leaves the
            // @font-face rules below in charge of where the files come from:
            // ours, served by the same Caddy, one round trip fewer and no third
            // party in the request log.
            presetWebFonts: { provider: 'none', fonts: { roboto: 'Roboto' } }
          })
        ],
        // The templates' design system: theme scale, shortcuts, preflights and
        // the safelist of its class names — plus the two self-hosted Roboto
        // subsets, declared here because the design system cannot know where an
        // app keeps its font files.
        ...ssgUnoConfig,
        preflights: [...ssgUnoConfig.preflights, selfHostedFonts],
        theme: ssgUnoConfig.theme,
        content: {
          pipeline: {
            include: [
              /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
              // The templates package IS scanned, and has to be: a template
              // component renders `q-separator` and `i-mdi-phone` as readily as
              // it renders an `ssg-*` class, and `unocss-preset-quasar` is what
              // turns both into CSS. Measuring this include against this site's
              // own sources showed 137 selectors that exist *only* because of
              // it — `q-separator`, `q-card__actions--*`, `q-btn-group*` and the
              // icons among them. Dropping it looks like a free 17 KB and is
              // actually an unstyled drawer with missing icons.
              //
              // The shortcut names are safelisted separately (`ssgSafelist`), so
              // it is not the shortcut CSS this supplies — it is the Quasar and
              // icon classes. The noise that rides along with it is bounded by
              // the design system's own `blocklist`.
              new RegExp(`${ssg.templatePackage}.*\\.js`)
            ]
          }
        }
      },
      ssr: {
        serverModules: ['vite-plugin-markdown']
      }
    }
  }

  if (mode === 'development') {
    config.server = {
      https: await certificateFor('vitrify.local')
    }
  }

  return config
}
