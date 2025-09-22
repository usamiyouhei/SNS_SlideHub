<template>
  <aside class="mt-6 space-y-4">
    <div class="rounded-xl border p-4 space-y-2">
      <div class="flex items-center gap-2">
        <h3 class="font-medium">スライド編集</h3>
        <span v-if="slide" class="text-xs opacity-60">#{{ slide.id.slice(-4) }}</span>
      </div>
      <p v-if="!slide" class="text-sm opacity-70">スライドを選択してください</p>
    </div>

    <!-- Slide Text -->
     <div class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">テキスト</h4>
     </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getSelected, addText, addImage  } from '../composables/useSlides';
import type { SlideText } from '../types';
/**===================================================================================================================
 * 
 ===================================================================================================================**/
const emit = defineEmits<{ remove: [id: string] }>()
const slide = computed(() => getSelected() as SlideText | null)

 //------------------------------------------------------------------------------------------------------------
// 引数
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
// メソッド
//------------------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
</style>