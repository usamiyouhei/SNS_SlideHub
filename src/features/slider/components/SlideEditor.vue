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
    <div v-if="current" class="rounded-xl border p-4 space-y-4">
      <h4 class="font-medium">テキスト</h4>
        <textarea v-model="current.text" rows="3" class="w-full rounded-lg border p-2" placeholder="ここに文章を入力"></textarea>
          <!-- Text Slide -->
        <div class="flex items-center gap-4">
          <label class="text-sm">文字サイズ</label>
          <input type="range" min="16" max="60" v-model.number="current.fontSize">
          <span class="text-sm w-10 text-right">{{ current.fontSize }}</span>
        </div>

      <div class="flex items-center gap-4">
        <label class="text-sm">文字色</label>
        <input type="color" class="" v-model="current.color">
      </div>
    </div>

    <!-- 背景 -->
    <div v-if="current"
        class="rounded-xl border p-4 space-y-4">
        <h4 class="font-medium">背景</h4>

        <div class="flex gap-4 items-center">
          <label class="inline-flex items-center gap-2">
            <input type="radio" value="color" v-model="current.bgType">
            <span>色</span>
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="radio" value="image" v-model="current.bgType">
            <span>画像</span>
          </label>
        </div>

        <div v-if="current.bgType === 'color'" class="flex items-center gap-2">

        </div>

        <!-- Image Slide -->
        <div v-else class="space-y-3">
          <input v-model="current.bgImage"  type="text" class="w-full rounded-lg border p-2" placeholder="画像URL">
          <div class="flex gap-2">
            <input id="bg-file" type="file" accept="image/*" class="sr-only" @click="onPickBg">
            <label for="bg-file" class="cursor-pointer">ファイルを選択</label>
          </div>

          <div class="flex gap-2">
            <input id="file-edit" type="file" accept="image/*" class="sr-only" @change="onPick">
            <label for="file-edit" class="cursor-pointer inline-flex items-center px-3 py-2 rounded-lg border bg-white hover:bg-zinc-100 active:scale-[0.99]">ファイルを選択</label>
            <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white" @click="applyImage" >差し替え</button>
          </div>
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
          <input id="file-new" type="file" accept="image/*" class="sr-only" @change="onPickNew">
          <label for="file-new" class="cursor-pointer inline-flex items-center px-3 py-2 rounded-lg border bg-white hover:bg-zinc-50 active:scale-[0.99]">
            ファイルを選択
          </label>
          <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white" @click="onAddImage">画像を追加</button>
        </div>

        <div v-if="newPickedUrl" class="rounded-lg border overflow-hidden">
          <img :src="newPickedUrl" alt="preview-new" class="max-w-full">
        </div>
      </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getSelected, addImage  } from '../composables/useSlides';
import type { Slide } from '../types';
/**===================================================================================================================
 * 
 ===================================================================================================================**/
const emit = defineEmits<{ remove: [id: string] }>()

// 現在のスライド（text か image のどちらか or null）
const current = computed<Slide | null>(() => getSelected())

// テキストスライドに絞ったビュー（text 以外は null）
// const textSlide = computed<Slide | null>(() => current.value?.type === 'text' ? current.value : null)

// const imageSlide = computed<Slide | null>(() => current.value?.bgType === 'image' ? current.value : null)
// image編集用
const imageUrl = ref('')
let pickedObjectUrl: string | null = null
const newPickedUrl = ref('')
let newPickedObjectUrl: string | null = null

function onPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if(!file) return
  if(pickedObjectUrl) URL.revokeObjectURL(pickedObjectUrl)
  pickedObjectUrl = URL.createObjectURL(file)
  imageUrl.value = pickedObjectUrl
}


// function applyImage() {
//   if(!imageSlide.value) return
//   const url = imageUrl.value.trim()
//   if(!url) return
//   imageSlide.value.src = url;
//   imageUrl.value = ''
//   if(pickedObjectUrl) {
//     URL.revokeObjectURL(pickedObjectUrl)
//     pickedObjectUrl = null
//   }
// }

// 新規追加
const newText = ref('');
const newSize = ref(28);
const newImageUrl = ref('')
function onAddText() {
  addText(newText.value , newSize.value)
  newText.value = ''
}
function onAddImage() {
  const src = ( newPickedUrl.value || newImageUrl.value ).trim()
  if(!src) return
  addImage(src)

  if(newPickedObjectUrl) {
    URL.revokeObjectURL(newPickedObjectUrl)
    newPickedObjectUrl = null
  }
  newPickedUrl.value = ''
  newImageUrl.value = ''
}

function onPickNew(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if(!file) return
  if(newPickedObjectUrl) URL.revokeObjectURL(newPickedObjectUrl)
  newPickedObjectUrl = URL.createObjectURL(file)
  newPickedUrl.value = newPickedObjectUrl
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