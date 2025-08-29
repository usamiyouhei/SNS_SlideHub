<!-- src/app.vue -->
<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <ClientOnly>
      <NuxtRouteAnnouncer />
    </ClientOnly>
  </NuxtLayout>
</template>

<style lang="sass" scoped>

</style>