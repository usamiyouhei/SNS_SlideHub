<template>
  <aside class="mt-6 space-y-4">
    <div class="rounded-xl border p-4 space-y-2">
      <div class="flex items-center gap-2">
        <h3 class="font-medium">スライド編集</h3>
        <span v-if="current" class="text-xs opacity-60">#{{ current.id.slice(-4) }}</span>
      </div>
      <p v-if="!current" class="text-sm opacity-70">スライドを選択してください</p>
    </div>

    <!-- Slide Text -->
    <div v-if="textSlide" class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">テキスト</h4>
        <textarea v-model="textSlide.text" rows="3" class="w-full rounded-lg border p-2" placeholder="ここに文章を入力"></textarea>
          <!-- Text Slide -->
        <div class="flex items-center gap-4">
          <label class="text-sm">文字サイズ</label>
          <input type="range" min="16" max="60" v-model.number="textSlide.fontSize">
          <span class="text-sm w-10 text-right">{{ textSlide.fontSize }}</span>
        </div>

      <div class="flex items-center gap-4">
        <label class="text-sm">文字色</label>
        <input type="color" class="" v-model="textSlide.color">
        <label class="text-sm">背景</label>
        <input type="color" v-model="textSlide.bg">
      </div>
    </div>

    <!-- Image Slide -->
    <div v-if="current && current.type === 'image'" class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">画像</h4>
      <input v-model="imageUrl"  type="text" class="w-full rounded-lg border p-2">

    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getSelected, addText, addImage  } from '../composables/useSlides';
import type { Slide, SlideText } from '../types';
/**===================================================================================================================
 * 
 ===================================================================================================================**/
const emit = defineEmits<{ remove: [id: string] }>()

// 現在のスライド（text か image のどちらか or null）
const current = computed<Slide | null>(() => getSelected())

// テキストスライドに絞ったビュー（text 以外は null）
const textSlide = computed<SlideText | null>(() => current.value?.type === 'text' ? current.value : null)


 //------------------------------------------------------------------------------------------------------------
// 引数
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
// メソッド
//------------------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
</style>