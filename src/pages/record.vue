<template>
  <div class="record-page">
    <!-- 全画面スライダー（ここだけ映るようにUIは極力消す） -->
    <div ref="frame" class="frame">
      <!-- 既存のスライダーをそのまま置く（autoplayで自動送りもOK） -->
      <Swiper
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="slider"
      >
        <SwiperSlide v-for="(s,i) in slides" :key="i">
          <div class="slide">
            <!-- 画像でもテキストでも動画でもOK -->
            <img v-if="s.type==='image'" :src="s.src" alt="" />
            <h2 v-else-if="s.type==='text'">{{ s.text }}</h2>
            <video v-else-if="s.type==='video'" :src="s.src" playsinline controls />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="controls">
      <button @click="startRecording" :disabled="isRec">録画開始</button>
      <button @click="stopRecording" :disabled="!isRec">停止＆保存</button>
      <small>ヒント: 共有ダイアログで「このタブ」と「タブの音声を共有」を選ぶ</small>
    </div>

    <!-- 任意のプレビュー -->
    <video ref="preview" class="preview" muted playsinline></video>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const frame = ref<HTMLElement|null>(null)
const preview = ref<HTMLVideoElement|null>(null)

const slides = [
  { type: 'text',  text: 'Hello! 次のスライドへ' },
  { type: 'image', src: '/img/photo1.jpg' },
  { type: 'video', src: '/videos/sample.mp4' },
  { type: 'text',  text: '録画モード超かんたん版 🎥' },
]

let stream: MediaStream|null = null
let rec: MediaRecorder|null = null
let chunks: BlobPart[] = []
const isRec = ref(false)

async function startRecording () {
  // タブの映像+音声をそのまま取得（※ダイアログで「このタブ」を選択）
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 30 },
    audio: true
  })

  if (preview.value) {
    preview.value.srcObject = stream
    preview.value.play().catch(() => {})
  }

  rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' })
  chunks = []
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
  rec.start(1000)
  isRec.value = true
}

function stopRecording () {
  if (!rec) return
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slider-${Date.now()}.webm`
    a.click()
    URL.revokeObjectURL(url)
    cleanup()
  }
  rec.stop()
}

function cleanup () {
  stream?.getTracks().forEach(t => t.stop())
  stream = null
  rec = null
  chunks = []
  isRec.value = false
}

onBeforeUnmount(cleanup)
</script>

<style scoped>
.record-page {
  height: 100dvh; display: grid; grid-template-rows: 1fr auto; gap: 12px;
  background: #000;
}
.frame {
  /* SNS比率に合わせたい場合は固定比にしてもOK（例: 1080x1920） */
  width: 100%; height: 100%; display: grid; place-items: center;
}
.slider, .slide { width: 100%; height: 100%; }
.slide { display: grid; place-items: center; }
.slide img, .slide video { max-width: 100%; max-height: 100%; }
.controls { display: flex; gap: 8px; align-items: center; padding: 8px 12px; color: #ddd; }
.preview { width: 240px; border: 1px solid #333; }
</style>