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
    <div v-if="slide" class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">テキスト</h4>
        <textarea v-model="slide.text" rows="3" class="w-full rounded-lg border p-2" placeholder="ここに文章を入力"></textarea>
          <!--  -->
        <div class="flex items-center gap-4">
          <label class="text-sm">文字サイズ</label>
          <input type="range" min="16" max="60" v-model.number="slide.fontSize">
          <span class="text-sm w-10 text-right">{{ slide.fontSize }}</span>
        </div>

      <div class="flex items-center gap-4">
        <label class="text-sm">文字色</label>
        <input type="color" class="" v-model="slide.color">
        <label class="text-sm">背景</label>
        <input type="color" v-model="slide.bg">
      </div>
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