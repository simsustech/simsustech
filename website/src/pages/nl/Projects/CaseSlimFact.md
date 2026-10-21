---
id: nl/case-slimfact
title: 'Praktijkvoorbeeld: SlimFact'
description: Een factuurdienst voor zzp'ers en kleine bedrijven — terugkerende
  facturen, een klantenportaal en e-facturatie voor Nederland en de EU.
label: SlimFact
headerImage: /images/simsustech-pattern.svg
---

## De opgave

Factureren is het deel van ondernemen waar niemand aan wil denken — en waar het
stilletjes misgaat: een factuur die na verzending is aangepast, een betaling die
niet meer aan een boeking te koppelen is, een Nederlandse e-facturatie-eis die te
laat boven tafel komt.

## Wat we hebben gebouwd

SlimFact, een factuurdienst die dagelijks wordt gebruikt door zzp'ers en kleine
bedrijven. Bekijk het op [slimfact.app](https://www.slimfact.app) of lees de
[productpagina](/nl/slimfact).

- **Onveranderlijke facturen.** Zodra een factuur bestaat, verandert die nooit
  meer, zodat er geen verschil kan ontstaan tussen wat de klant ontving en wat de
  administratie zegt.
- **Bonnen, kwitanties en facturen** voor werk dat nog verandert: een bon wordt
  een kwitantie zodra er betaald is, en op verzoek een factuur.
- **Een klantenportaal.** Klanten zien hun facturen, bonnen en kwitanties op één
  plek in plaats van papierwerk achterna te lopen.
- **Terugkerende facturatie** volgens schema — wekelijks tot per kwartaal —
  zodat abonnementen worden gefactureerd zonder dat iemand eraan hoeft te denken.
- **Meerdere bedrijven vanuit één account**, elk met eigen huisstijl,
  bankgegevens en factuurnummering.
- **E-facturatie die past bij Nederland en de EU:** UBL en Peppol XML,
  haarscherpe PDF's gerenderd met Typst, EPC-QR-codes voor overschrijvingen en
  CSV-exports als iemand toch een spreadsheet wil.
- **Een headless API.** SlimFact is API-first, zodat facturatie te automatiseren
  is of in een andere applicatie te bouwen.
- **Single sign-on** via elke OpenID Connect-provider, en een interface in het
  Engels, Nederlands of Duits.

## Hoe het is gebouwd

Een Vue- en Quasar-frontend op een Fastify-API, met PostgreSQL erachter en PDF's
die on the fly worden gegenereerd. Het draait in dezelfde zelf-gehoste stack als
onze overige software — en dezelfde stack waarop we klantapplicaties bouwen.

## Het resultaat

- Een factuur kan na verzending niet meer worden aangepast, dus de versie die de
  klant heeft en de versie in de boeken kunnen niet uit elkaar lopen.
- Abonnementen worden volgens schema gefactureerd zonder dat iemand eraan hoeft
  te denken.
- Een Nederlandse of EU-e-facturatie-eis wordt gedekt door de export die er al
  is, niet door haastwerk voor een deadline.
- Eén account draait meerdere bedrijven, elk met eigen nummering, bankgegevens en
  huisstijl.

## Wat het kost

€15 per maand. [Neem contact op](/nl/contact) en we helpen je op weg.
