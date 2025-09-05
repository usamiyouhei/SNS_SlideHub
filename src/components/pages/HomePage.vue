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

    <div class="grid gap-6 md:grid-cols-[360px-auto] items-start">
      <!-- スワイパー枠 -->
      <div class="w-[360px] h-[540px] rounded-2xl overflow-hidden border bg-gray-500">
        <Swiper class="w-full h-full">
          <SwiperSlide v-for="s in slides[mode]" :key="s.id">
            <div class="w-full h-full relative grid place-items-center breake-words">
              <!-- 画像 -->
              <img
                v-if="s.type === 'image'"
                :src="s.src"
                alt=""
                class="w-full h-hull absolute inset-0 object-cover"
              >
              <!-- テキスト -->
              <div 
                v-else-if="s.type === 'text'"
                class="px-6 text-center break-words">
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

      <!-- right editer -->
      <aside class="space-y-4">
        <!-- add text -->
        <div class="rounded-xl border p-4 space-y-2">
          <h3 class="font-medium">テキストを追加</h3>
          <textarea class="w-full rounded-lg border p-2" name="" id="" placeholder="ここに文章"></textarea>
          <div class="rounded-xl border p-4 space-y-2">
            <label class="text-sm" for="">文字サイズ</label>
            <input type="text">
            <span>textSize</span>
            <button class="px-3 py-2 rounded-lg bg-zinc-900 text-white">テキスト追加</button>
          </div>
        </div>

        <!-- add image -->
          <div class="rounded-xl border p-4 space-y-2">
            <h3 class="font-medium">画像を追加</h3>
            <input type="file" />
            <div class="flex gap-2">
              <input type="text" class="flex-1 rounded-lg border p-2" placeholder="画像を貼る">
              <button
                class="px-3 py-2 rounded-lg bg-zinc-900 text-white">
                  画像追加
              </button>
            </div>
          </div>

      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import "swiper/css";

/**===================================================================================================================
 * 
 ===================================================================================================================**/
type Mode = 'lesson' | 'gallery'
const mode = ref<Mode>('lesson')

type Slide = 
|{  id: string;
    type: 'text';
    text: string;
    fontsize:number;
  }
|{  id: string;
    type: 'image';
    src: string
  }

const slides = reactive<Record<Mode, Slide[]>>({
  lesson: [
    { id: 'l1', type: 'text', text: '単語: accomodation', fontsize: 28 },
    { id: 'l2', type: 'image', src: '/img/photo.jpg' }
  ],
  gallery: [
    { id: 'g1', type: 'image', src: '/img/photo.jpg'},
    { id: 'g2', type: 'image', src: '/img/photo.jpg'},
  ]

})
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
</style>