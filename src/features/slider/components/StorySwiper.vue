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
            <div class="w-full h-full grid place-items-center"
                :style="s.type === 'text' ? { background: s.bg || '#222'} : undefined"
                @click="startEdit(i)">
                <div v-if="s.type === 'image'"  class="relative w-full h-full">
                  <img 
                    :src="s.src" 
                    alt="" 
                    class="w-full h-full absolute inset-0 object-cover"
                    >
                <div v-if="!(isEditing && editingIndex === i)"
                  class="absolute inset-0 grid place-items-center"
                  @click.stop="startEditOverlay(i)">
                  <div 
                    class="px-6 text-center break-words"
                    :style="{ fontSize : (s.fontSize || 28) + 'px', color: s.color || '#fff' , whiteSpace: 'pre-wrap'}">
                    {{ s.text }}
                  </div>
                </div>
                <div v-else
                  contenteditable="plaintext-only"
                  :ref="el => setEditorRef(el, i)"
                  class="absolute inset-0 grid "
                  :style="{ whiteSpace: 'pre-wrap'}"
                  @input="onOverlayInput(i, $event)"
                  @keydown="onEditorKeydown"
                  @blur="stopEdit"
                  ></div>

                </div>
              <!-- 編集時は contenteditable を1つだけ出す。非編集時は表示だけ -->

              <template v-if="isEditing && editingIndex === i">
                <!-- 編集中：Vue は中身を描画しない -->
                  <div 
                    contenteditable="plaintext-only"
                    :ref="el => setEditorRef(el, i)"
                    class="px-6 text-center break-words no-swiping-class"
                    :class="{'no-swiping-class': isEditing && editingIndex === i}"
                    :style="{ fontSize: (s.fontSize || 28) + 'px', color: s.color || '#fff'}"
                    @input="onAnyTextInput(i, $event)"
                    @keydown="onEditorKeydown"
                    @blur="stopEdit">
                  </div>
              </template>
                  <!-- 非編集時：通常描画 -->
              <template v-else>
                <div
                  class="px-6 text-center break-words"
                  :style="{fontSize: (s.fontSize || 28) + 'px', color: s.color || '#fff'}"
                >
                {{ s.text }}
                </div>
              </template>

              <!-- 選択中の枠 -->
              <div v-if="selectedId === s.id" class="absolute inset-2 rounded-xl ring-4 ring-blue-500/70 pointer-events-none"></div>
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
  isEditing.value = true;
  editingIndex.value = i;
  await nextTick();
  const el = editorRefs.value[i];
  if(el) {
    // 初期テキストを手動で反映（以後は @input で s.text を更新）
    const s = slides[mode.value][i];
    if(s?.type === 'text') 
    el.textContent = (s as any).text ?? '';
    // 末尾にキャレットを移動
    placeCaretAtEnd(el)
    el.focus()
  }
}

function stopEdit() {
  isEditing.value = false
  editingIndex.value = null
}

// 入力反映テキスト
function onAnyTextInput(i: number, e: Event) {
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

// 画像差し替え
function onPickFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  (e.target as HTMLInputElement).value = '' ; // 同じファイル再選択でも反応させたい
  if(!file) return

  const idx = editingIndex.value ?? activeIndex.value;
  const s = slides[mode.value][idx];
  if(!s || s.type !== 'image') return;
  const url = URL.createObjectURL(file);
  s.src = url;
}

// // 画像クリック → ファイル選択
// function onPickImage(i: number) {
//   setSelectedByIndex(i)
//   editingIndex.value = i
//   fileInputRef.value?.click()
// }

// 画像テキスト編集開始
async function startEditOverlay(i: number) {
  isEditing.value = true
  editingIndex.value = i
  await nextTick()
  const el = editorRefs.value[i]
  if(!el) return
  const s = slides[mode.value][i]
  if(s?.type === 'image'){
    el.textContent = s.text ?? '';
    placeCaretAtEnd(el)
    el.focus()
  }
}

// 入力を SlideImage.text に反映（描画は非編集時だけなのでカーソルは飛ばない）
function onOverlayInput(i: number, e: Event){
  const el = e.target as HTMLElement
  const s = slides[mode.value][i]
  if(s?.type === 'image') s.text = el.innerText
}


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
  setSelectedByIndex(sw.realIndex ?? sw.activeIndex ?? 0)
}

function onSlideChange(sw: any) {
  setSelectedByIndex(sw.realIndex ?? sw.activeIndex ?? 0)
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