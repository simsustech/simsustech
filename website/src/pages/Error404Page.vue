<template>
  <main
    class="ssg-section flex flex-center text-center min-h-[60vh] bg-[var(--q-surface-container-low)] text-[var(--q-on-surface)]"
  >
    <div class="ssg-section__inner">
      <!--
        A real `h1`: the 404 page is a page like any other, and `ssg verify`
        requires exactly one `h1` on every page.

        The page keeps the header and footer — an earlier version covered the
        whole viewport with `fullscreen`, so a lost visitor had no navigation at
        all, only a button.
      -->
      <h1 class="text-[clamp(5rem,18vw,10rem)] leading-none m-0">404</h1>

      <p class="text-step-1 opacity-80 mt-space-2 mb-0">Sorry, nothing here.</p>

      <CtaButton class="mt-space-4" label="Go home" route="/" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { CtaButton } from '@simple-site-generator/templates'

defineOptions({ name: 'Error404Page' })
</script>
