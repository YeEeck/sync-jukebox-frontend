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
         <button 
          class="remove-btn" 
          @click.stop="handleRemove(item)" 
          title="Remove from playlist"
        >
          <!-- SVG Trash Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-trash">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.565-2.264a3 3 0 01-1.992-1.992l-.18-.72-10.79 3.09-.17.71a3 3 0 01-1.99 1.992l-.566 2.264a.75.75 0 01-.49-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
            <path d="M5.055 5.386a.75.75 0 01.387-1.168A49.152 49.152 0 018.667 3.257l.711-.177a.75.75 0 01.18 1.488l-.711.177a47.652 47.652 0 00-2.613.882l.06 2.406h11.412l.06-2.406a47.618 47.618 0 00-2.613-.882l-.711-.177a.75.75 0 01.18-1.488l.711.177a49.152 49.152 0 013.225.961.75.75 0 01.387 1.168l-.837 13.386a3 3 0 01-2.991 2.812H8.258a3 3 0 01-2.991-2.812L4.218 5.386z" /> 
            <!-- 简化版 Trash Icon path (Material Design 风格) -->
             <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </li>
    </ul>
    <p v-else class="empty-message">The playlist is currently empty.</p>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
const store = usePlayerStore();

const handleRemove = (item) => {
  // 注意：根据后端 API 定义，我们需要传 songId。
  // item.song_id 通常是数据库中关联表的 ID 或歌曲 ID。
  // 假设后端需要的是歌曲本身的 UUID (item.song.id) 或者关联记录的 UUID (item.song_id)。
  // 如果 item.song_id 指的是这首个具体的歌曲资源 ID：
  store.removeSongFromPlaylist(item.song_id);
};
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
  padding-right: 0.1rem;
  margin: 0;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.5rem;
  padding-right: 1.0rem;
  border-bottom: 1px solid #282828;
  transition: background-color 0.2s ease;
  cursor: pointer;

  position: relative;
}

.song-item:hover {
  background-color: #2a2a2a;
}

.song-item:hover .remove-btn {
  opacity: 1;
  transform: translateX(0);
}

.song-item:last-child {
  border-bottom: none;
}

/* 歌曲详情 (复用自 MediaLibrary) */
.song-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  /* 确保文字不会盖住按钮，留出空间 */
  max-width: 85%;
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

/* --- 删除按钮样式 --- */
.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 默认状态：完全透明或半透明，稍微向右偏移 */
  opacity: 0; 
  transform: translateX(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #b3b3b3; /* 默认灰色 */
}

/* 按钮悬停状态：变成红色 */
.remove-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff5555; /* 警告红 */
}

.remove-btn:active {
  transform: scale(0.95);
}

.icon-trash {
  width: 18px;
  height: 18px;
  fill: currentColor;
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
