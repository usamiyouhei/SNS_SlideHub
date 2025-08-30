export function useRecorder() {
  const isRec = ref(false);
  const withMic = ref(true);
  let stream: MediaStream | null = null;
  let rec: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];

  async function startRecording(_opts: { targetEl?: HTMLElement|null } = {}) {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: withMic.value
    });
    rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
    chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.start(1000);
    isRec.value = true;
  }

  function stopRecording() {
    if (!rec) return;
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slider-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      cleanup();
    };
    rec.stop();
  }

  function cleanup() {
    stream?.getTracks().forEach(t => t.stop());
    stream = null; rec = null; chunks = []; isRec.value = false;
  }

  onBeforeUnmount(cleanup);
  return { isRec, withMic, startRecording, stopRecording };
}