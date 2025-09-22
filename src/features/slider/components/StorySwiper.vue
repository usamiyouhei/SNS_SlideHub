<template>
  <div class="grid gap-10 md:grid-cols-[48px_1fr_48px] items-center">
    <!-- 右ナビ -->
    <button class="prev-btn hidden md:flex items-center w-12 h-12 rounded-full border"
      @click="prev"
    >‹</button>

    <!-- canvas -->
      <div class="w-full aspect-[9/16]">
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
              <img v-if="s.type === 'image'" src="" alt="" class="w-full h-full absolute inset-0 object-cover">
              <div v-else class="px-6 text-center break-words">
                {{ s.text }}
              </div>

              <!-- 選択中の枠 -->
              <div v-if="selectedId === s.id" class="absolute inset-2 rounded-xl ring-4 ring-blue-500/70 pointer-events-none"></div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 左ナビ -->
    <button class="next-btn hidden md:flex items-center w-12 h-12 rounded-full border"
      @click="next"
    >›</button>

  </div>
</template>

<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules';
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { mode, selectedId, setSelectedByIndex, slides } from '../composables/useSlides';

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
</style>