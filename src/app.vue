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
