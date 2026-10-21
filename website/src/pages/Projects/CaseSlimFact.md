---
id: case-slimfact
title: 'Case study: SlimFact'
description: An invoicing service for freelancers and small businesses —
  recurring invoices, a client portal, and e-invoicing for the Netherlands and
  the EU.
label: SlimFact
headerImage: /images/simsustech-pattern.svg
---

## The problem

Invoicing is the part of running a business nobody wants to think about — and
the part that quietly goes wrong: an invoice edited after it was sent, a payment
that cannot be traced back to a booking, a Dutch e-invoicing requirement
discovered too late.

## What we built

SlimFact, an invoicing service in daily use by freelancers and small companies.
See it at [slimfact.app](https://www.slimfact.app) or read the
[product page](/slimfact).

- **Immutable invoices.** Once an invoice exists it never changes, so there is
  no gap between what the customer received and what the books say.
- **Bills, receipts and invoices** for work that still changes: a bill becomes a
  receipt when it is paid, and a receipt becomes an invoice on request.
- **A client portal.** Customers see their invoices, bills and receipts in one
  place instead of chasing paperwork.
- **Recurring billing** on a schedule — weekly to quarterly — so subscriptions
  are invoiced without anyone remembering to invoice them.
- **Several companies from one account**, each with its own branding, bank
  details and invoice numbering.
- **E-invoicing that fits the Netherlands and the EU:** UBL and Peppol XML,
  pixel-perfect PDFs rendered with Typst, EPC QR codes for bank transfers, and
  CSV exports when someone insists on a spreadsheet.
- **A headless API.** SlimFact is API-first, so invoicing can be automated or
  built into another application.
- **Single sign-on** through any OpenID Connect provider, and a UI in English,
  Dutch or German.

## How it is built

A Vue and Quasar front end on a Fastify API, backed by PostgreSQL, with PDFs
generated on the fly. It runs in the same self-hosted stack as the rest of our
software, and the same stack we build client applications on.

## The result

- An invoice cannot be edited after it is sent, so the version the customer holds
  and the version in the books cannot drift apart.
- Subscriptions are invoiced on schedule without anyone remembering to invoice
  them.
- A Dutch or EU e-invoicing requirement is met by the export that is already
  there, not by a scramble before a deadline.
- One account runs several companies, each with its own numbering, banking
  details and branding.

## What it costs

€15 per month. [Get in touch](/contact) and we will help you set it up.
