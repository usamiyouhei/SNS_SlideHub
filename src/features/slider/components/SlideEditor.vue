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
    <div v-if="imageSlide" class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">画像</h4>
      <input v-model="imageSlide.src"  type="text" class="w-full rounded-lg border p-2" placeholder="画像URL">

      <div v-if="imageUrl" class="rounded-lg border overflow-hidden">
        <img :src="imageUrl" alt="preview" class="max-w-full">
      </div>

      <div class="flex gap-2">
        <input id="new-file" type="file" accept="image/*" @change="onPick">
        <label for="new-file" class="cursor-pointer inline-flex items-center px-3 py-2 rounded-lg border bg-white hover:bg-zinc-100 active:scale-[0.99]">ファイルを選択</label>
        <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white" @click="applyImage" >差し替え</button>
      </div>
    </div>

    <!-- 共通削除 -->
    <div v-if="current" class="rounded-xl border p-4">
      <button class="text-red-600 hover:underline" @click="$emit('remove', current.id)">削除する</button>
    </div>

      <!-- 追加機能 -->
      <div class="rounded-xl border p-4 space-y-4">
        <h4 class="font-medium">新規追加</h4>

        <div class="space-y-3">
          <textarea v-model="newText" rows="2" class="w-full rounded-lg border p-2" placeholder="新しいテキスト"></textarea>
          <div class="flex items-center gap-3">
            <label class="text-sm">文字サイズ</label>
            <input type="range" min="16" max="60" v-model.number="newSize" >
            <span class="text-sm w-10 text-right">{{ newSize }}</span>
            <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white" @click="onAddText">テキスト追加</button>
          </div>
        </div>

        <div class="space-y-2">
          <input v-model="newImageUrl" type="text" class="w-full rounded-lg border py-2" placeholder="画像URL">
          <input id="new-file" type="file" accept="image/*" @change="onPickNew">
          <label for="file-new" class="cursor-pointer inline-flex items-center px-3 py-2 rounded-lg border bg-white hover:bg-zinc-50 active:scale-[0.99]">
            ファイルを選択
          </label>
          <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white" @click="onAddImage">画像を追加</button>
        </div>
      </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getSelected, addText, addImage  } from '../composables/useSlides';
import type { Slide, SlideImage, SlideText } from '../types';
/**===================================================================================================================
 * 
 ===================================================================================================================**/
const emit = defineEmits<{ remove: [id: string] }>()

// 現在のスライド（text か image のどちらか or null）
const current = computed<Slide | null>(() => getSelected())

// テキストスライドに絞ったビュー（text 以外は null）
const textSlide = computed<SlideText | null>(() => current.value?.type === 'text' ? current.value : null)

const imageSlide = computed<SlideImage | null>(() => current.value?.type === 'image' ? current.value : null)
// image編集用
const imageUrl = ref('')
const newPickedUrl = ref('')
let newPickedObjectUrl: string | null = null

// function onPick(e: Event) {
//   const file = (e.target as HTMLInputElement).files?.[0]
//   if(!file) return
//   if(pickedObjectUrl) URL.revokeObjectURL(pickedObjectUrl)
//   pickedObjectUrl = URL.createObjectURL(file)
//   imageUrl.value = pickedObjectUrl
// }
function onPickNew(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if(!file) return
  if(newPickedObjectUrl) URL.revokeObjectURL(newPickedObjectUrl)
  newPickedObjectUrl = URL.createObjectURL(file)
  imageUrl.value = newPickedObjectUrl
}

function applyImage() {
  if(!imageSlide.value) return
  const url = imageUrl.value.trim()
  if(!url) return
  imageSlide.value.src = url;
  imageUrl.value = ''
}

// 新規追加
const newText = ref('');
const newSize = ref(28);
const newImageUrl = ref('')
function onAddText() {
  addText(newText.value , newSize.value)
  newText.value = ''
}
function onAddImage() {
  addImage(newImageUrl.value)
  newImageUrl.value = ''
}
 //------------------------------------------------------------------------------------------------------------
// 引数
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
// メソッド
//------------------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
</style>