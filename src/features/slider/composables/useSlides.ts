import { ref, reactive } from "vue";
import type { Mode , Slide, SlideState } from "../types";

export const mode = ref<Mode>('lesson')
export const activeIndex = ref(0)
export const selectedId = ref<string | null>(null) // クリック選択中のスライド

export const slides = reactive<SlideState>({
  lesson: [
    { id: 'l1', bgType: 'color', bgColor: '#fff', text: '単語: accomodation', fontSize: 28, color: '#222' },
    { id: 'l2', bgType: 'image', bgImage: '/img/photo1.jpeg' }
  ],
  gallery: [
    { id: 'g1', bgType: 'image', bgImage: '/img/photo2.jpeg'},
    { id: 'g2', bgType: 'image', bgImage: '/img/photo3.jpeg'},
  ]
  
})

// export function addText(text: string, size: number){
//   if(!text.trim()) return
//   slides[mode.value].push({
//     id:`t-{Date.now()}`,
//     type: 'text',
//     text: text.trim(),
//     fontSize: size,
//     bg:'#fff',
//     color: '#222'
//   })
// }

// export function addImage(url: string) {
//   if(!url.trim()) return
//   slides[mode.value].push({
//     id:`i-{Date.now()}`,
//     type:'image',
//     src: url.trim()
//   })
// }

export function addSlide(bgType: 'color'| 'image', options: Partial<Slide> = {}) {
  const s : Slide = {
    id:`${ bgType } - ${Date.now()}`,
    bgType,
    bgColor: options.bgColor ?? '#222',
    bgImage: options.bgImage ?? '',
    text: options.text ?? '',
    fontSize: options.fontSize ?? 28,
    color: options.color ?? '#fff'
  }
  const arr = slides[mode.value]
  arr.push(s)

    // ★ 追加直後に新規スライドを選択
    setSelectedByIndex(arr.length - 1)

    return s
}

export function addBlankColorSlide() {
    return addSlide('color', { bgColor:'#222', text:'', fontSize:28, color:'#fff' })
}


// i = インデックス番号（0, 1, 2 …）
// 	s = その配列の要素（Slide オブジェクト）
export function removeSlide(id: string) {
  const arr = slides[mode.value] // 今のモード (lesson / gallery) のスライド配列
  const i = arr.findIndex(s => s.id === id) // s は Slide (text か image)
  if(i >= 0 ) arr.splice(i, 1) // 見つかった位置を削除
}

export function setSelectedByIndex(i: number) {
  activeIndex.value = i
  const s = slides[mode.value][i] // i 番目の Slide
  selectedId.value = s?.id ?? null // その Slide の id を記録
}

// selectedId に一致するスライドを返す。なければ null。
export function getSelected(): Slide | null {
  const arr = slides[mode.value]
  return arr.find(s => s.id === selectedId.value) ?? null
}