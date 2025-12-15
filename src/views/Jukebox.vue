<template>
  <div class="jukebox-layout">
    <header>SyncJukebox</header>
    <main>
      <div class="left-panel">
        <MediaLibrary />
      </div>
      <div class="right-panel">
        <Playlist />
      </div>
    </main>
    <footer>
      <PlayerControls />
    </footer>
  </div>
</template>

<script setup>
import MediaLibrary from '../components/MediaLibrary.vue';
import Playlist from '../components/Playlist.vue';
import PlayerControls from '../components/PlayerControls.vue';
</script>

<style scoped>
.jukebox-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
header {
  padding: 1rem;
  background-color: #181818;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0; /* 防止header被压缩 */
}
main {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 1.5rem; /* --- 新增：给整个主内容区一个外边距 --- */
  gap: 1.5rem;    /* --- 新增：在左右面板之间创建间距 --- */
}
.left-panel,
.right-panel {
  flex: 1;
  background-color: #181818; /* 给面板一个背景色，视觉上更清晰 */
  border-radius: 8px;       /* 添加圆角，更美观 */
  padding: 1.5rem;          /* --- 新增：给面板内部内容增加边距 --- */
  overflow-y: auto;         /* 保持内容可滚动 */
}
footer {
  background-color: #181818; /* 与PlayerControls的背景色统一 */
  flex-shrink: 0;           /* 防止footer被压缩 */
}
/* --- 新增：自定义滚动条样式 --- */
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}
.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track {
  background: #181818; /* 滚动条轨道颜色，与面板背景色相同 */
  border-radius: 10px;
}
.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb {
  background-color: #535353; /* 滚动条滑块颜色 */
  border-radius: 10px;
  border: 2px solid #181818; /* 创建一个围绕滑块的边框效果 */
}
.left-panel::-webkit-scrollbar-thumb:hover,
.right-panel::-webkit-scrollbar-thumb:hover {
  background-color: #777; /* 鼠标悬停时滑块的颜色 */
}
</style>
