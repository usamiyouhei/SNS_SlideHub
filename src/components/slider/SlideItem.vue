<template>
  <SlideText  v-if="slide.type==='text'"  :text="slide.payload.text"  :style="slide.style" />
  <SlideImage v-else-if="slide.type==='image'" :src="slide.payload.src" :style="slide.style" />
  <SlideVideo v-else :src="slide.payload.src" />
</template>

<script setup lang="ts">

const props = defineProps<{ slide: any }>();
</script>