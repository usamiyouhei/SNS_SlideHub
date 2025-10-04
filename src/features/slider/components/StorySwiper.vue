<template>
  <div class="grid gap-10 md:grid-cols-[48px_1fr_48px] items-center">
    <!-- 右ナビ -->
    <button class="prev-btn hidden md:flex items-center justify-center w-12 h-12 rounded-full border"
      @click="prev"
    >‹</button>

    <!-- canvas -->
      <div
        class="w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden border bg-gray-300"
        style="--swiper-navigation-color:#fff; --swiper-navigation-size:28px; --swiper-pagination-color:#fff;">
        <Swiper
          :modules="[Navigation,Pagination]"
          :loop="true"
          :preventClicks="false"
          :preventClicksPropagation="false"
          :slideToClickedSlide="true"
          :allowTouchMove="!isEditing"
          :noSwiping="true"
          :noSwipingClass="'no-swiping-class'"
          class="w-full h-full"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          @click="onSwiperClick"
          >
          <SwiperSlide
            v-for="(s, i) in slides[mode]"
            :key="s.id"
          >
          <!-- 背景：画像（必要なときだけ） -->
              <div class="relative w-full h-full grid place-items-center"
                :style="s.bgType === 'color' ? { background: s.bgColor || '#222'} : undefined"
                @click="startEdit(i)">
                  <!-- 画像スライド -->
                  <img v-if="s.bgType === 'image' && s.bgImage"
                    :src="s.bgImage"
                    alt=""
                    class="w-full h-full absolute inset-0 object-cover"
                  >
                <!-- 編集中：contenteditable（Vueは中身を描かない） -->
                <div v-if="isEditing && editingIndex === i"
                  contenteditable="plaintext-only"
                  :ref="el => setEditorRef(el, i)"
                  class="absolute inset-0 grid place-items-center no-swiping-class"
                  :style="{whiteSpace: 'pre-wrap', color:(s.color || '#fff'), fontSize:(s.fontSize || 28) + 'px' }"
                  @click.stop
                  @input="onTextInput(i, $event)"
                  @keydown="onEditorKeydown"
                  @blur="stopEdit"
                  @dblclick="startEdit(i)">
                </div>
                <!-- 非編集時：通常表示 -->
                <div v-else
                  class="px-6 text-center break-words"
                  :style="{whiteSpace: 'pre-wrap', fontSize : (s.fontSize || 28) + 'px', color: s.color || '#fff' ,}">
                  {{ s.text }}
                </div>
              <!-- 選択中の枠 -->
              <div v-if="selectedId === s.id" 
                class="absolute inset-2 rounded-xl ring-4 ring-blue-500/70 pointer-events-none">
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onPickFile"
        />
      </div>

      <!-- 左ナビ -->
    <button class="next-btn hidden md:flex items-center justify-center w-12 h-12 rounded-full border"
      @click="next"
    >›
    </button>
    <!-- Pagination -->
    <div class="flex mt-3 justify-center gap-2">
    <button
      v-for="(_, i) in slides[mode]"
      :key="i"
      @click="go(i)"
      class="w-2.5 h-2.5 rounded-full transition"
      :class="i === activeIndex ? 'bg-blue-500' : 'bg-zinc-400 opacity-60 hover:opacity-90'"
      aria-label="Go to slide"
    />
    </div>


  </div>
</template>

<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules';
import { nextTick,ref, type ComponentPublicInstance } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { activeIndex, mode, selectedId, setSelectedByIndex, slides,  } from '../composables/useSlides';
import type { Slide } from "../types";

/**===================================================================================================================
 *
===================================================================================================================**/
const swiperRef = ref<any | null>(null);

watch(activeIndex, (i) => {
  if(!swiperRef.value?.slideTo) return
  if(typeof swiperRef.value.slideToLoop === 'function') {
    swiperRef.value.slideToLoop(i)
} else {
  swiperRef.value.slideTo(i)
}
})

const isEditing = ref(false)
const editingIndex = ref<number | null>(null)
const editorRefs = ref<(HTMLElement | null)[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// エディタ要素の参照を保持
function setEditorRef(el:Element | ComponentPublicInstance | null, i: number) {
  const node = (el && (el as any).$el) ? (el as any).$el as Element : (el as Element | null)
  editorRefs.value[i] = node instanceof HTMLElement ? node : null
}

// // スライド背景クリック時の挙動
// function onSlideBodyClick(i: number, s: Slide) {
//   setSelectedByIndex(i)

//   if(s.type === 'text') {
//     startEdit(i)
//   } else if (s.type === 'image') {
//     fileInputRef.value?.click();
//     editingIndex.value = i
//   }
// }

// 編集開始（テキスト）
async function startEdit(i: number) {
  if(isEditing.value && editingIndex.value === i ) return
  isEditing.value = true;
  editingIndex.value = i;
  await nextTick();
  const el = editorRefs.value[i];
  if(!el) return
    // 初期テキストを手動で反映（以後は @input で s.text を更新）
    const s = slides[mode.value][i];
    el.textContent = (s as any).text ?? '';
    // 末尾にキャレットを移動
    placeCaretAtEnd(el)
    el.focus()
}

function stopEdit() {
  isEditing.value = false
  editingIndex.value = null
}

// 入力反映テキスト
function onTextInput(i: number, e: Event) {
  const el = e.target as HTMLElement
  const s = slides[mode.value][i];
  if(s)(s as any).text = el.innerText;
}

// Enterで改行、Escで編集終了
function onEditorKeydown(e: KeyboardEvent) {
  if(e.key === 'Escape') {
    (e.target as HTMLElement).blur()
    stopEdit()
  }
}

function onPickbgImage() {
  const idx = editingIndex.value ?? activeIndex.value
  if(idx === null) return
  fileInputRef.value?.click()
}

// 画像差し替え
function onPickFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0];
  input.value = '' ; // 同じファイル再選択でも反応させたい
  if(!file) return

  const idx = editingIndex.value ?? activeIndex.value;
  const arr = slides[mode.value];
  if(idx < 0 || idx >= arr.length) return

  const s = arr[idx];
  if(!s) return

  const url = URL.createObjectURL(file);
  s.bgType = 'image' as const
  s.bgImage = url;
}

// // 画像クリック → ファイル選択
// function onPickImage(i: number) {
//   setSelectedByIndex(i)
//   editingIndex.value = i
//   fileInputRef.value?.click()
// }

// 画像テキスト編集開始
// async function startEditOverlay(i: number) {
//   isEditing.value = true
//   editingIndex.value = i
//   await nextTick()
//   const el = editorRefs.value[i]
//   if(!el) return
//   const s = slides[mode.value][i]
//   if(s?.type === 'image'){
//     el.textContent = s.text ?? '';
//     placeCaretAtEnd(el)
//     el.focus()
//   }
// }

// 入力を SlideImage.text に反映（描画は非編集時だけなのでカーソルは飛ばない）
// function onOverlayInput(i: number, e: Event){
//   const el = e.target as HTMLElement
//   const s = slides[mode.value][i]
//   if(s?.type === 'image') s.text = el.innerText
// }


// キャレットを末尾へ
function placeCaretAtEnd(el:HTMLElement) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el)
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range)
}


function onSwiper(sw: any) {
  swiperRef.value = sw
  const idx = sw.realIndex ?? sw.activeIndex ?? 0
  if(selectedId.value) {
    if(typeof sw.slideToLoop === 'function') sw.slideToLoop(activeIndex.value)
    else sw.slideTo(activeIndex.value)
  } else {
    setSelectedByIndex(idx)
  }
}

function onSlideChange(sw: any) {
  const idx = sw.realIndex ?? sw.activeIndex ?? 0
  if( idx !== activeIndex.value) setSelectedByIndex(idx)
}

function prev() {
  swiperRef.value?.slidePrev()
}

function next() {
  swiperRef.value?.slideNext()
}

function go(i:number) {
  swiperRef.value?.slideToLoop ? swiperRef.value?.slideToLoop(i) : swiperRef.value?.slideTo(i)
}

function select(i: number) {
  setSelectedByIndex(i)
}

// クリックで実インデックス取得（loop対策）
function onSwiperClick(sw: any) {
    // ループ時はクローンがあるため、data-swiper-slide-index が「実インデックス」
  const idx = Number(sw?.clickedSlide?.dataset?.swiperSlideIndex ?? -1)
  if(idx >= 0) setSelectedByIndex(idx)
}
 //------------------------------------------------------------------------------------------------------------
// 引数
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
// 定数・変数（state）
//------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------
// メソッド
//------------------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
.swiper-pagination-bullet { width:10px; height:10px; opacity:.6; }
.swiper-pagination-bullet-active { opacity:1; }
</style>