<template>
  <div class="library">
    <h2>Media Library</h2>
    <!-- 文件上传 -->
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" accept="audio/*" />
    </div>
    <!-- 歌曲列表 -->
    <ul class="song-list">
      <li v-for="song in store.mediaLibrary" :key="song.id" class="song-item">
        <div class="song-details">
          <span class="song-title">{{ song.title }}</span>
          <span class="song-artist">{{ song.artist || 'Unknown Artist' }}</span>
        </div>
        <div class="song-actions">
          <button @click="store.addToPlaylist(song.id)" title="Add to playlist">+</button>
          <!-- --- 新增删除按钮 --- -->
          <button @click="confirmRemove(song)" class="delete-btn" title="Delete from library">×</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
const store = usePlayerStore();

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    store.uploadSong(file);
    event.target.value = '';
  }
};

const confirmRemove = (song) => {
  if (window.confirm(`Are you sure you want to permanently delete "${song.title}"? This action cannot be undone.`)) {
    store.removeSongFromLibrary(song.id);
  }
};
</script>

<style scoped>
/* 为了更好的视觉效果，我们稍微美化一下列表 */
.song-list {
  list-style: none;
  padding: 0;
}
.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid #282828;
  transition: background-color 0.2s;
}
.song-item:hover {
  background-color: #2a2a2a;
}
.song-details {
  display: flex;
  flex-direction: column;
}
.song-title {
  font-weight: 500;
}
.song-artist {
  font-size: 0.8rem;
  color: #b3b3b3;
}
.song-actions button {
  margin-left: 0.5rem;
  background: none;
  border: 1px solid #535353;
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.song-actions .delete-btn {
  border-color: #812828;
  color: #e04444;
}
.upload-section {
  margin-bottom: 1rem;
}
</style>