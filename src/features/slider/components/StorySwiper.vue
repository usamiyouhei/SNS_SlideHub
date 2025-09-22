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
          class="w-full h-full"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          >
          <SwiperSlide
            v-for="(s, i) in slides[mode]"
            :key="s.id"
            @click="select(i)">
            <div class="w-full h-full grid place-items-center"
                :style="s.type === 'text' ? { background: s.bg || '#222'} : undefined">
              <img v-if="s.type === 'image'" :src="s.src" alt="" class="w-full h-full absolute inset-0 object-cover">
              <div v-else 
                class="px-6 text-center break-words"
                :style="{ fontSize: (s.fontSize || 28) + 'px', color: s.color || '#fff'}">
                {{ s.text }}
              </div>

              <!-- 選択中の枠 -->
              <div v-if="selectedId === s.id" class="absolute inset-2 rounded-xl ring-4 ring-blue-500/70 pointer-events-none"></div>
            </div>
          </SwiperSlide>
        </Swiper>
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
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { activeIndex, mode, selectedId, setSelectedByIndex, slides } from '../composables/useSlides';

/**===================================================================================================================
 * 
 ===================================================================================================================**/
const swiperRef = ref<any | null>(null);

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