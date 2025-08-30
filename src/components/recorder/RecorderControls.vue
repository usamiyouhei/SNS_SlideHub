<template>
  <div class="flex gap-2">
    <button class="btn" :disabled="isRec" @click="start">録画</button>
    <button class="btn" :disabled="!isRec" @click="stop">停止</button>
    <label class="flex items-center gap-1 text-sm">
      <input type="checkbox" v-model="withMic" />マイク
    </label>
  </div>
</template>

<script setup lang="ts">
import { useRecorder } from '@/composables/useRecorder';
const props = defineProps<{ targetEl?: HTMLElement | null }>();
const { isRec, startRecording, stopRecording, withMic } = useRecorder();
const start = () => startRecording({ targetEl: props.targetEl });
const stop  = () => stopRecording();
</script>

<style scoped>
.btn { @apply px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700; }
</style>