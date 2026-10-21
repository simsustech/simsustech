---
id: nl/case-simsustech
title: 'Praktijkvoorbeeld: deze website'
description: Hoe simsus.tech zelf is gebouwd — Markdown erin, gecontroleerde
  statische site eruit, gegenereerd met onze eigen open-source kit.
label: Deze website
image: /images/simsustech.svg
headerImage: /images/simsustech-pattern.svg
---

## De opgave

De website van een softwarebureau moet twee dingen tegelijk doen. Hij moet
bewijzen dat wij snelle, toegankelijke sites bouwen — en hij moet goedkoop en
eenvoudig te onderhouden zijn, want onze tijd gaat liever naar klantwerk dan naar
onze eigen website.

De gebruikelijke oplossingen falen op één van de twee. Een websitebouwer is
goedkoop in beheer maar zegt niets over ons vakmanschap. Een site met de hand
onderhouden zegt veel, maar kost voor altijd aandacht.

## Wat we hebben gebouwd

Deze site. Elke pagina is een Markdown-bestand met een paar regels frontmatter,
en de build maakt daar statische HTML van. Geen serverrendering, geen database en
geen CMS dat gepatcht moet worden.

- **Inhoud in Markdown**, met een getypeerd contract voor wat frontmatter mag
  bevatten: id, titel, beschrijving, menuvolgorde, call-to-actions.
- **Eén designsysteem**, uitgedrukt als UnoCSS-configuratie in plaats van
  stylesheets, zodat de typografie- en spatiëringsschaal in elke template
  identiek is en er geen losse CSS-bestanden uit elkaar kunnen lopen.
- **Twee talen**, een gegenereerde sitemap en robots-policy, en structured data
  voor de organisatie en elke pagina.

![De build-pijplijn: Markdown-inhoud, vooraf gerenderd door Vitrify met Vue en Quasar, gecontroleerd op toegankelijkheid, SEO, budgetten en Lighthouse, en daarna als statische bestanden geserveerd door Caddy](/images/stack-simsus.tech.svg)

## Waar het draait

Statische bestanden achter Caddy, waarbij voorziene assets onveranderlijk
worden gecachet en de entry-bestanden opnieuw gevalideerd. Een paar megabyte
vooraf gebouwde HTML serveren kost vrijwel niets, en zonder runtime valt er niets
aan te vallen.

## Het resultaat

- Elke pagina is een statisch bestand; er wordt niets per verzoek gerenderd.
- **195 KB** JavaScript en **34 KB** CSS, gecomprimeerd, tegen budgetten van
  250 KB en 60 KB. Die budgetten zijn hard: een wijziging die eroverheen gaat
  laat de build falen in plaats van dat je het in het veld ontdekt.
- Toegankelijkheid, best practices en SEO: **100** in de laatste controle-run,
  over 39 pagina's. Prestaties gemeten op 90 in de mobiele Lighthouse-run, waar
  wat overblijft het applicatieframework is en niet de inhoud.
- Een nieuwe pagina is één Markdown-bestand. Dezelfde inhoud bedient beide talen.
- De generator erachter is open source:
  [simsustech/simple-site-generator](https://github.com/simsustech/simple-site-generator).

![Lighthouse-scores voor deze site: toegankelijkheid 100, best practices 100, SEO 100, prestaties 90](/images/lighthouse-simsus.tech.svg)

[Wil je zo'n website? Neem contact op.](/nl/contact)
