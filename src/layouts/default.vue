<template>
  <div class="min-h-dvh flex flex-col">
    <header class="border-b">
      <AppHeader />
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t">
      <AppFooter />
    </footer>

    <!-- モーダルなどのテレポート先 -->
    <div id="modal-root" />
  </div>
</template>

<script setup lang="ts">
import { AppHeader, AppFooter } from '#components'

</script>