<template>
  <div class="min-h-dvh flex flex-col">
      <LayoutAppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t">
      <LayoutAppFooter />
    </footer>

    <!-- モーダルなどのテレポート先 -->
    <div id="modal-root" />
  </div>
</template>

<script setup lang="ts">
import { LayoutAppHeader, LayoutAppFooter } from '#components'

</script>

<style lang="sass" scoped>

</style>