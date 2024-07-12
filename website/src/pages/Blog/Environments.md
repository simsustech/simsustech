---
id: environments
title: Environments
label: Environments
---
## Environments
There is an abundance of guides on the internet on which environments a developer could use, but here is my take:

1. Development\
  Your development server, preferably with hot-module reload (HMR) in which all development takes place.
2. Testing\
  For local testing, you can just use the development server. For CI/CD, setup a Docker container, populate it with the test data and run your tests against that.
3. Staging\
  A live replica of your production environment which you can use as a preview environment for manual testing. Uses the `staging` image of your application.
4. Production\
  If the staging environment works without issues, you can release a `production` image and update your production environment.

### Development server
[Vitrify](https://github.com/simsustech/vitrify)\
[Vite](https://vite.dev)

### Database
[Postgres](https://www.postgresql.org) ([docker](https://hub.docker.com/_/postgres/))\
[Kysely](https://www.kysely.dev/)

### Testing tools
E2E: [Playwright](https://playwright.dev)\
Unit test: [Vitest](https://vitest.dev)

### CI/CD
[Github actions](https://docs.github.com/en/actions)