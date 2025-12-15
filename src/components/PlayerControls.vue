<template>
  <div class="controls-wrapper">
    <!-- 歌曲信息 -->
    <div class="song-info">
      <p>{{ store.currentSong?.title || 'No song selected' }}</p>
      <small>{{ store.currentSong?.artist || '...' }}</small>
    </div>

    <div class="main-controls">
      <div class="buttons">
        <button @click="store.prev()">⏮</button>
        <button @click="togglePlayPause">{{ store.isPlaying ? '⏸' : '▶️' }}</button>
        <button @click="store.next()">⏭</button>
      </div>
      <div class="progress-bar">
        <!-- 如果正在拖动，显示拖动到的时间，否则显示服务器同步的时间 -->
        <span>{{ formatTime(isSeeking ? localProgressValue : store.progressMs) }}</span>
        <input type="range" min="0" :max="store.currentSong?.duration_ms || 0"
          :value="isSeeking ? localProgressValue : store.progressMs" @mousedown="handleSeekStart" @input="handleSeeking"
          @change="handleSeekEnd" />
        <span>{{ formatTime(store.currentSong?.duration_ms || 0) }}</span>
      </div>
    </div>
    <div class="volume-control">
      <span>🔊</span>
      <input type="range" min="0" max="1" step="0.01" :value="store.localVolume" @input="onVolumeChange" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePlayerStore } from '@/stores/player.js';
const store = usePlayerStore();

const onVolumeChange = (event) => {
  const newVolume = parseFloat(event.target.value);
  store.setLocalVolume(newVolume);
};

const togglePlayPause = () => {
  if (store.isPlaying) {
    store.pause();
  } else {
    store.play();
  }
};

// --- 用于拖动逻辑的本地状态 ---
const isSeeking = ref(false);
const localProgressValue = ref(0);
const handleSeekStart = () => {
  isSeeking.value = true;
};
const handleSeeking = (event) => {
  // 仅更新本地的进度值，不触发任何 action
  localProgressValue.value = parseInt(event.target.value, 10);
};
const handleSeekEnd = (event) => {
  const newPositionMs = parseInt(event.target.value, 10);
  store.seekTo(newPositionMs);
  isSeeking.value = false;
};

const formatTime = (ms) => {
  if (!ms) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.controls-wrapper {
  display: flex;
  justify-content: space-between;
  /* 关键：将三块内容推到两端和中间 */
  align-items: center;
  padding: 1rem;
  /* 关键：增加内边距 */
  gap: 2rem;
  /* 关键：增加块之间的间距 */
  background-color: #181818;
  /* 改为更深的背景色以区分 */
}

.song-info {
  flex: 1;
  /* 占据左侧可用空间 */
  min-width: 150px;
}

.main-controls {
  flex: 2;
  /* 占据中间大部分空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}

.progress-bar {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.progress-bar input[type="range"] {
  flex-grow: 1;
}

.volume-control {
  flex: 1;
  /* 占据右侧可用空间 */
  display: flex;
  justify-content: flex-end;
  /* 让内容靠右 */
  align-items: center;
  min-width: 150px;
  gap: 0.5rem;
}
</style>