<template>
  <div class="playlist">
    <h2>Playlist</h2>
    <ul>
      <li 
        v-for="item in store.playlist" 
        :key="item.id"
        :class="{ 'is-playing': item.song_id === store.currentSongId }"
      >
        {{ item.song.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
const store = usePlayerStore();
</script>

<style scoped>
.is-playing { color: #1DB954; font-weight: bold; }
</style>
