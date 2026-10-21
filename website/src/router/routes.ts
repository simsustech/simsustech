import type { RouteRecordRaw } from 'vue-router'
// The slim virtual module carries ONLY the site identity the client needs.
// Importing `virtual:vitrify-config` instead inlined the entire build config
// (including the whole UnoCSS/Quasar option tree) into the browser bundle.
import { site } from 'virtual:ssg:site'
import { QNoSsr } from 'quasar'
import { defineAsyncComponent, h } from 'vue'
import { Layout } from 'virtual:ssg:template'

const { tags, extra } = site

/** Frontmatter a page file may declare (see CONTENT-BLUEPRINT.md). */
interface PageFrontmatter {
  id?: string
  title?: string
  /**
   * The document title, verbatim — no ` | simsustech` suffix.
   *
   * The front page is what this exists for: its `<h1>` is a sentence, and its
   * title in a browser tab is the site's name. The suffix names the site
   * *inside* a page's title, which for the front page would name it twice.
   */
  headTitle?: string
  label?: string
  description?: string
  /** Sort weight; the home page is always first. */
  order?: number
  /** Name of the template component to render, e.g. `Landing`. */
  page?: string
  /** Render this page client-side only. */
  noSsr?: boolean
  /** Keep the page out of the index and the sitemap. */
  noindex?: boolean
  image?: string
  /** BCP-47 tag when this page is not in the site's default language. */
  lang?: string
  /** Other-language versions of this page, emitted as hreflang links. */
  alternates?: { lang: string; path: string; label?: string }[]
  breadcrumbs?: string[]
  tags?: string[]
  [key: string]: unknown
}

interface PageModule {
  attributes?: PageFrontmatter
  html?: string
  default?: unknown
}

/**
 * Markdown and Vue pages, eagerly imported so the route table is complete at
 * module-evaluation time (prerendering needs every route to exist up front).
 *
 * The pattern MUST be relative. The previous version was a bare `src/pages` path,
 * which Vite 8 rejects outright — "Invalid glob … It must start with '/' or
 * './'" — so the glob resolved to nothing and every page silently disappeared
 * from the build.
 *
 * Note for editors: never write a glob containing a `*` immediately followed by a
 * `/` inside a block comment — the `*` + `/` pair closes the comment early and
 * the rest of the comment is parsed as code.
 */
const pagesImport = import.meta.glob(
  ['../pages/**/*.{md,vue}', '!**/Error404Page.vue'],
  { eager: true }
)

const noSsrComponent = {
  name: 'NoSSRWrapper',
  render(this: { component: unknown; page: unknown }) {
    const component = defineAsyncComponent(this.component as never)
    return h(QNoSsr, null, {
      default: () => h(component, this.page as Record<string, unknown>)
    })
  },
  props: ['page', 'component']
}

function attributesOf(page: unknown): PageFrontmatter {
  return (page as PageModule | undefined)?.attributes ?? {}
}

/**
 * Whether a page renders a language's root path.
 *
 * `home` is the kit's id for the front page; `nl` is this site's, because `/nl`
 * is where the Dutch home page is served and its id is the same tag that carries
 * the language (see `languageOf`). Both belong at the top of their own language's
 * menu — otherwise the Dutch home page sorts below every page that happens to
 * declare an `order`.
 */
function isRootPage(id: string | undefined): boolean {
  return id === 'home' || id === 'nl'
}

/**
 * Each language's root page first, then pages with an explicit `order`, then the
 */
const orderedPages = [
  ...Object.entries(pagesImport)
    .filter(([, page]) => {
      const { id, order = 0 } = attributesOf(page)
      return order || isRootPage(id)
    })
    .sort(([, pageA], [, pageB]) => {
      const { id: idA, order: orderA = 0 } = attributesOf(pageA)
      const { id: idB, order: orderB = 0 } = attributesOf(pageB)

      // One is a language's root and the other is not: the root comes first.
      // Both or neither falls through to `order`, so two roots are not compared
      // in both directions by a comparator that returns a constant.
      if (isRootPage(idA) !== isRootPage(idB)) {
        return isRootPage(idA) ? -1 : 1
      }

      return orderA - orderB
    }),
  ...Object.entries(pagesImport).filter(([, page]) => {
    const { id, order = 0 } = attributesOf(page)
    return !order && id && !isRootPage(id)
  })
]

/**
 * Language alternates.
 *
 * The Dutch pages are `nl/`-prefixed ids (`website` / `nl/website`), which is
 * also the path they are served at, so the pairing of a page with its
 * translation is a pure function of the id. Deriving it here means no page
 * needs `alternates` or `lang` frontmatter: add the `nl/` twin and both sides of
 * the hreflang cluster — and the language switch in the header — appear by
 * themselves. (`nl/website` is what the kit's own `idFromPath` would derive from
 * `src/pages/nl/website.md`, so the convention costs nothing to keep.)
 *
 * A single-language site gets `undefined`, so it emits no hreflang cluster at
 * all instead of a page pointing at itself.
 */
const LANGUAGE = { en: 'en-GB', nl: 'nl' } as const

const LANGUAGE_LABEL: Record<string, string> = {
  [LANGUAGE.en]: 'English',
  [LANGUAGE.nl]: 'Nederlands'
}

/**
 * The heading above the home page's card band, per language.
 *
 * The kit's card band labels itself in English (`Services`), and this is a word
 * a visitor reads — the Dutch page had it above a grid of Dutch cards. It has to
 * vary per page, so it cannot come from the site config's `extra` bag, which
 * holds one string for the whole site; resolving it here keeps it beside the
 * language switch's own labels, the other strings the pages do not own.
 */
const CARDS_HEADING: Record<string, string> = {
  [LANGUAGE.en]: 'Services',
  [LANGUAGE.nl]: 'Diensten'
}

function languageOf(id: string): string {
  return id === 'nl' || id.startsWith('nl/') ? LANGUAGE.nl : LANGUAGE.en
}
/**
 * The page list the shell and the router share.
 *
 * Each entry carries its language, derived here rather than declared in every
 * `nl/` file's frontmatter: it is already a function of the id (see
 * `languageOf`), and the navigation matches it against the language of the page
 * being viewed — without it, the Dutch pages' menu is the English one.
 */
const pageList = orderedPages.map(([, page]) => {
  const attributes = attributesOf(page)

  return {
    ...attributes,
    lang: attributes.lang ?? languageOf(attributes.id ?? '')
  }
})

function counterpartIdOf(id: string): string {
  if (id === 'nl') return 'home'
  if (id === 'home') return 'nl'

  return id.startsWith('nl/') ? id.slice(3) : `nl/${id}`
}

function alternatesOf(
  id: string
): { lang: string; path: string; label?: string }[] | undefined {
  const candidates = [id, counterpartIdOf(id)].filter(
    (candidate, index, all) => all.indexOf(candidate) === index
  )

  const entries = candidates
    .filter((candidate) => pageList.some((page) => page.id === candidate))
    .map((candidate) => {
      const lang = languageOf(candidate)

      return {
        lang,
        path: candidate === 'home' ? '/' : `/${candidate}`,
        label: LANGUAGE_LABEL[lang]
      }
    })

  return entries.length > 1 ? entries : undefined
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    props: {
      ...site,
      pages: pageList,
      tags,
      extra
    },
    children: [
      ...orderedPages.map(([, page]) => {
        const { id = '', page: componentName = '', noSsr } = attributesOf(page)
        const { attributes = {}, html = '' } = (page ?? {}) as PageModule

        const vuePage = async () => {
          if ((page as PageModule).default) {
            return (page as PageModule).default
          }

          return import('virtual:ssg:template').then((module) => {
            const templates = module.default

            // No component named: the template's `Page` is the default.
            if (!componentName) return module.Page

            const component = templates[componentName]

            // A named component that does not exist used to fall back to
            // `module.Page` silently — the worst outcome for a field that decides
            // a page's entire layout, because the page renders, looks plausible
            // and is the wrong template. Thrown during prerender, so it fails the
            // build instead of shipping.
            if (!component) {
              const available = Object.keys(templates)
                .sort((a, b) => a.localeCompare(b))
                .join(', ')

              throw new Error(
                `Unknown page template component "${componentName}" on page "${id}".\n` +
                  `  \`page:\` names a component from the configured template module,\n` +
                  `  which provides: ${available}. Most pages should omit \`page:\`\n` +
                  `  entirely and get the template's default \`Page\`.`
              )
            }

            return component
          })
        }

        const lang = attributes.lang ?? languageOf(id)

        const props = {
          ...attributes,
          content: html,
          pages: pageList,
          // The business details (phone, reviews, service area) live on the site
          // config, not in each page's frontmatter, but the page needs them for
          // its proof/CTA sections — so they are passed down here rather than
          // duplicated into every page. `cardsHeading` travels with them for the
          // same reason: it is a value the page renders, not one it declares,
          // and the frontmatter alternative means the same word in every page
          // that shows cards.
          extra: { ...extra, cardsHeading: CARDS_HEADING[lang] }
        }

        return {
          // The home page lives at the parent path, so its child path is empty.
          path: id === 'home' ? '' : id,
          name: id,
          component: noSsr ? noSsrComponent : vuePage,
          props: noSsr ? { page: props, component: vuePage } : props,
          alias: id === 'home' ? ['home'] : [],
          /**
           * The single source of truth about a page, read by both the shell (for
           * `<head>` tags) and the build (for the sitemap).
           */
          meta: {
            id,
            title: attributes.title,
            headTitle: attributes.headTitle,
            description: attributes.description,
            noindex: attributes.noindex ?? false,
            image: attributes.image,
            lang,
            alternates: attributes.alternates ?? alternatesOf(id),
            breadcrumbs: attributes.breadcrumbs
          }
        } as RouteRecordRaw
      }),

      // An explicit /404 route so the SSG emits `dist/static/404.html`, which
      // `build/Caddyfile` serves through `try_files … /404.html`. Without it the
      // file is never generated and Caddy falls back to its own error page. The
      // catch-all below only covers client-side navigation.
      {
        path: '404',
        name: '404',
        component: () => import('../pages/Error404Page.vue'),
        meta: { id: '404', title: 'Page not found', noindex: true }
      },

      // The catch-all is a CHILD of the layout on purpose. As a sibling it
      // rendered outside the shell, so it had no header, no footer and — because
      // `useSeo` lives in the layout — no `<head>` tags at all. Vue Router ranks
      // a catch-all last, so it cannot shadow a real page.
      {
        path: ':catchAll(.*)*',
        name: 'not-found',
        component: () => import('../pages/Error404Page.vue'),
        meta: { id: '404', title: 'Page not found', noindex: true }
      }
    ]
  }
]

export default routes
