---
id: nl/case-petboarding
title: 'Praktijkvoorbeeld: Petboarding'
description: Een boekings- en dagopvangsysteem voor dierenpensions — planning,
  bezetting, facturatie en een klantenportaal op één plek.
label: Petboarding
headerImage: /images/simsustech-pattern.svg
---

## De opgave

Een pension of dagopvang draait op een papieren agenda: welke hond in welk
verblijf zit, wiens vaccinatie is verlopen, wie heeft vorige maand nog niet
betaald. Dat werkt tot het niet meer werkt — een dubbele boeking, een gemiste
betaling, of een middag administratie in plaats van dieren.

## Wat we hebben gebouwd

Petboarding, een boekingssysteem voor pensions en dagopvang. Bekijk het op
[petboarding.app](https://www.petboarding.app) of lees de
[productpagina](/nl/petboarding).

- **Dierenprofielen** — ras, vaccinaties, voerschema, medicatie, gewicht en een
  foto, binnen seconden te vinden.
- **Dagopvang** — een maandkalender, prepaid-pakketten, bulkgoedkeuringen en
  automatische dagaftrek.
- **Een visuele verblijfsindeling** waarin dieren in verblijven worden gesleept,
  met vaccinatiebadges, capaciteitslimieten en voer- of medicatievlaggen in
  beeld.
- **Bezetting en financiën** — een bezettingsheatmap voor capaciteitsplanning,
  plus facturatie die openstaande boekingen, facturen en betaalhistorie volgt.
- **Drie rollen** — klant, medewerker, beheerder — elk met precies wat ze nodig
  hebben.
- **Configureerbaar per bedrijf:** eigen prijzen, openingstijden, optionele
  diensten, geblokkeerde periodes, vakantietoeslagen en e-mailsjablonen.

## Hoe het is gebouwd

Een Vue- en Quasar-frontend op een Fastify-API — dezelfde stack als ons overige
werk. Het is in de eerste plaats een webapplicatie: te installeren als app,
werkt op desktop, tablet en mobiel, in licht of donker thema, in het Engels of
Nederlands.

## Het resultaat

- De verblijfsindeling staat op het scherm, met capaciteitslimieten en
  vaccinatiebadges naast het dier dat geplaatst wordt — een vol pension of een
  verlopen vaccinatie komt niet pas 's ochtends aan het licht.
- Openstaande boekingen, facturen en betaalhistorie zitten in hetzelfde systeem
  dat de boeking aannam, dus factureren is geen aparte klus meer.
- Klanten regelen een verblijf zonder te bellen, en de administratie is een
  bijvangst van de boeking in plaats van een taak op zich.

[Zoek je iets dergelijks? Neem contact op.](/nl/contact)
