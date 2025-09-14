<template>
  <section class="p-6 md:p-8 space-y-6">
    <div class="inline-flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 ">
      <button
        class="px-4 py-2 text-sm"
        :class="mode === 'lesson' ? 'bg-zinc-600 text-white' : 'bg-white dark:bg-zinc-800'"
        @click="mode = 'lesson'"
        >
        教材モード
      </button>
      <button
        class="px-4 py-2 text-sm"
        :class="mode === 'gallery' ? 'bg-zinc-600 text-white' : 'bg-white dark:bg-zinc-800'"
        @click="mode = 'gallery'"
        >
        ギャラリーモード
      </button>
    </div>

    <div
      class=" grid gap-10 md:grid-cols-[48px_1fr_48px] items-center">

      <!-- 左の外部ナビ -->
      <button 
        class="prev-btn hidden md:flex items-center justify-center w-12 h-12 rounded-full border"
        @click="prev">
        ‹
      </button>
      <!-- スワイパー枠 （録画部分）-->
      <div 
        class="w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden border bg-gray-300"
        style="--swiper-navigation-color:#fff; --swiper-navigation-size:28px; --swiper-pagination-color:#fff;"
      >
        <Swiper
          :loop="true"
          @swiper="onSwiper"
          class="w-full h-full main-swiper"
          >
          <SwiperSlide
            v-for="s in slides[mode]"
            :key="s.id">
            <div class="w-full h-full relative grid place-items-center break-words">
              <!-- 画像 -->
              <img
                v-if="s.type === 'image'"
                :src="s.src"
                alt=""
                class="w-full h-full absolute inset-0 object-cover"
              >
              <!-- テキスト -->
              <div
                v-else-if="s.type === 'text'"
                class="px-6 text-center break-words"
                :style="{fontSize: s.fontSize + 'px'}">
                {{ s.text }}
              </div>

              <!-- フォールバック -->
              <div v-else class="opacity-60">
                empty
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 右の外部ナビ -->
        <button 
          class="next-btn hidden md:flex items-center justify-center w-12 h-12 rounded-full border"
          @click="next"
          >
          ›
        </button>
    </div>

      <div class="flex mt-3 justify-center gap-2">
        <button
          v-for="(_, i) in slides[mode]"
          :key="i"
          @click="go(i)"
          class="w-2.5 h-2.5 rounded-full transition"
          :class="i===active ? 'bg-blue-500' : 'bg-zinc-400 opacity-60 hover:opacity-90' "
          aria-label="Go to slide"
          />
      </div>

      <!-- right editer -->
      <aside class="mt-6 space-y-4">
        <!-- add text -->
        <div class="rounded-xl border p-4 space-y-4">
          <h3 class="font-medium">テキストを追加</h3>
          <textarea v-model="textInput" rows="3" class="w-full rounded-lg border p-2" name="" id="" placeholder="ここに文章"></textarea>
          <div class="flex items-center gap-3 ">
            <label class="text-sm" for="">文字サイズ</label>
            <input type="range" min="16" max="48" v-model.number="textSize">
            <span class="text-sm w-10 text-right">{{textSize}}</span>
            <button 
              class="px-3 py-2 rounded-lg bg-zinc-900 text-white"
              @click="addText()">テキスト追加</button>
          </div>
        </div>

        <!-- add image -->
          <div class="rounded-xl border p-4 space-y-2">
            <h3 class="font-medium">画像を追加</h3>
            <input type="file" accept="image/*" @change="onPickImage"/>
            <div class="flex gap-2">
              <input 
                v-model="imgUrl"
                type="text" class="flex-1 rounded-lg border p-2" 
                placeholder="画像を貼る"
                >
              <button
                class="px-3 py-2 rounded-lg bg-zinc-900 text-white"
                @click="addImage()">
                  画像追加
              </button>
            </div>
          </div>

          <!-- slide list -->
           <div class="rounded-xl border p-a space-y-2">
            <h3 class="text-medium">スライド一覧</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center justify-between">
                <span>
                  <span class="opacity-70"></span>
                </span>
                <button>削除</button>
              </li>
            </ul>
           </div>

      </aside>
    
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import "swiper/css";
// import { Pagination, Navigation } from "swiper/modules";
// import 'swiper/css/pagination'
// import 'swiper/css/navigation'


/**===================================================================================================================
 * 
 ===================================================================================================================**/
type Mode = 'lesson' | 'gallery'
const mode = ref<Mode>('lesson')

type Slide = 
|{  id: string;
  type: 'text';
  text: string;
  fontSize:number;
}
|{  id: string;
  type: 'image';
  src: string
}

const slides = reactive<Record<Mode, Slide[]>>({
  lesson: [
    { id: 'l1', type: 'text', text: '単語: accomodation', fontSize: 28 },
    { id: 'l2', type: 'image', src: '/img/photo1.jpeg' }
  ],
  gallery: [
    { id: 'g1', type: 'image', src: '/img/photo2.jpeg'},
    { id: 'g2', type: 'image', src: '/img/photo3.jpeg'},
  ]
  
})

// text add
const textInput = ref('')
const textSize = ref(28)
function addText() {
  if(!textInput.value.trim()) return
  slides[mode.value].push({
    id: `t-${Date.now()}`,
    type: 'text',
    text: textInput.value.trim(),
    fontSize: textSize.value,
  })
  textInput.value = ''
}

// addImage
const imgUrl = ref('')
let pickedFileUrl: string | null = null

function onPickImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if(!file) return
  pickedFileUrl && URL.revokeObjectURL(pickedFileUrl)
  pickedFileUrl = URL.createObjectURL(file)
  imgUrl.value = pickedFileUrl
}

function addImage() {
  const url = imgUrl.value.trim()
  if(!url) return
  slides[mode.value].push({ id: `i-${Date.now()}`, type: 'image', src: url})
  imgUrl.value = ''
}

// const paginationEl = ref<HTMLElement|null>(null)
// const pagination = reactive<any>({ el: null, clickable: true })

const swiperRef = ref<any | null>(null)
const active = ref(0)

function onSwiper(swiper: any) {
  swiperRef.value = swiper
  active.value = swiper.realIndex ?? swiper.activeIndex
}

function onSlideChange(swiper: any) {
  active.value = swiper.realIndex ?? swiper.activeIndex
}

function prev() {
  swiperRef.value?.slidePrev()
}

function next() {
  swiperRef.value?.slideNext()
}

function go(i: number) {
    // loop:true なので slideToLoop を使うのが簡単
  swiperRef.value?.slideToLoop ? swiperRef.value.slideToLoop(i) : swiperRef.value?.slideToLoop(i)
}

function removeSlide(id: string) {
  const array = slides[mode.value]
  const index = array.findIndex(s => s.id === id)
  if(index >= 0) array.splice(index, 1)
}

// onMounted(() => { pagination.el = paginationEl.value }) 
 //------------------------------------------------------------------------------------------------------------
// 引数
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
// 定数・変数（state）
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
// ライフサイクル
//------------------------------------------------------------------------------------------------------------
/*
onBeforeMount(() => {
  //記憶した位置、サイズでの復帰を可能にする
})

onMounted(() => {
  //window.addEventListener('resize', onGetPosition)
})

onBeforeUnmount(() => {
  //window.removeEventListener('resize', onGetPosition)
})
*/
//------------------------------------------------------------------------------------------------------------
//watch
//------------------------------------------------------------------------------------------------------------
/*
watch(
  () => props.value,
  (value) => {
    input.value = value
  }
)
//------------------------------------------------------------------------------------------------------------
//computed
//------------------------------------------------------------------------------------------------------------
/*
const counter: Ref<number> = useState('counter', () => 500)

// computedによりcounter変数の監視が行われる
const doubleCount = computed(() => {
  return counter.value * 2
})
*/
//------------------------------------------------------------------------------------------------------------
// エミット
//------------------------------------------------------------------------------------------------------------
/*
const emits = defineEmits<{ (e: 'update:value', item: any): void }>()
const input = ref(props.value)

function onChange(value: any) {
  input.value = value
  emits('update:value', value)
}
*/

//------------------------------------------------------------------------------------------------------------
// メソッド
//------------------------------------------------------------------------------------------------------------
</script>

<style lang="scss" scoped>
.swiper-pagination-bullet { width:10px; height:10px; opacity:.6; }
.swiper-pagination-bullet-active { opacity:1; }

// .main-swiper .swiper-pagination{
//   position: static !important;
//   margin-top: 12px;
//   text-align: center;
// }
</style>