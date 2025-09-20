import { ref, reactive } from "vue";
import type { Mode , Slide, SlideState } from "../types";

export const mode = ref<Mode>('lesson')
export const activeIndex = ref(0)
export const selectedId = ref<string | null>(null) // クリック選択中のスライド

export const slides = reactive<SlideState>({
  lesson: [
    { id: 'l1', type: 'text', text: '単語: accomodation', fontSize: 28 },
    { id: 'l2', type: 'image', src: '/img/photo1.jpeg' }
  ],
  gallery: [
    { id: 'g1', type: 'image', src: '/img/photo2.jpeg'},
    { id: 'g2', type: 'image', src: '/img/photo3.jpeg'},
  ]
  
})

