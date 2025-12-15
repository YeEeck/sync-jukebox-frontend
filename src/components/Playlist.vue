<template>
  <div class="playlist-container">
    <h2>Playlist</h2>
    <ul v-if="store.playlist && store.playlist.length > 0" class="song-list">
      <li v-for="item in store.playlist" :key="item.id" class="song-item"
        :class="{ 'is-playing': store.currentSongId === item.song_id }">
        <div class="song-details">
          <span class="song-title">{{ item.song.title }}</span>
          <span class="song-artist">{{ item.song.artist }}</span>
        </div>
        <!-- 列表项右侧可以根据需要添加操作按钮或时长显示 -->
      </li>
    </ul>
    <p v-else class="empty-message">The playlist is currently empty.</p>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
const store = usePlayerStore();
</script>

<style scoped>
.playlist-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.playlist-container h2 {
  flex-shrink: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #282828;
}

.song-list, .empty-message {
  flex: 1;
  overflow-y: auto;
}

.song-list {
  list-style: none;
  padding-right: 1.5rem;
  margin: 0;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #282828;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.song-item:hover {
  background-color: #2a2a2a;
}

.song-item:last-child {
  border-bottom: none;
}

/* 歌曲详情 (复用自 MediaLibrary) */
.song-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.song-title {
  font-weight: 500;
  color: #fff;
}

.song-artist {
  font-size: 0.8rem;
  color: #b3b3b3;
}

/* 高亮当前播放的歌曲 */
.song-item.is-playing .song-title {
  color: #1db954;
  /* Spotify 绿色 */
  font-weight: bold;
}

.song-item.is-playing .song-artist {
  color: #1db954;
}

/* 播放列表为空时的提示信息 */
.empty-message {
  color: #b3b3b3;
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
}

/* --- 自定义滚动条样式 --- */
.song-list::-webkit-scrollbar {
  width: 8px;
  /* 滚动条宽度 */
}

.song-list::-webkit-scrollbar-track {
  background: #181818;
  /* 滚动条轨道颜色，与面板背景色相同 */
  border-radius: 10px;
}

.song-list::-webkit-scrollbar-thumb {
  background-color: #535353;
  /* 滚动条滑块颜色 */
  border-radius: 10px;
  border: 2px solid #181818;
  /* 创建一个围绕滑块的边框效果 */
}

.song-list::-webkit-scrollbar-thumb:hover {
  background-color: #777;
  /* 鼠标悬停时滑块的颜色 */
}
</style>
