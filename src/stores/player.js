import { defineStore } from 'pinia';
import api from '@/api';
import { websocketService } from '@/services/websocket';

const VOLUME_STORAGE_KEY = 'jukebox_volume';

// --- 辅助函数：从 localStorage 安全地加载音量 ---
const loadInitialVolume = () => {
  const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
  // 检查 savedVolume 是否为 null 或 undefined。
  // 如果直接用 parseFloat(savedVolume) || 0.5，当保存的音量是 0 时，会被错误地重置为 0.5。
  if (savedVolume !== null) {
    return parseFloat(savedVolume);
  }
  return 0.5; // 默认音量
};

export const usePlayerStore = defineStore('player', {
  // State: 镜像后端的 GlobalState，并增加一些前端自身的状态
  state: () => ({
    // 后端同步的状态
    isPlaying: false,
    currentSongId: null,
    currentSong: null,
    playlist: [],
    currentPlaylistIdx: -1,
    progressMs: 0,
    playMode: 'REPEAT_ALL',
    // 前端自身的状态
    isAuthenticated: false,
    mediaLibrary: [],
    localVolume: loadInitialVolume(),
  }),

  getters: {
    // 计算当前歌曲的音频文件URL
    currentSongUrl: (state) => {
      // 不再依赖不存在的 filePath，而是直接使用 state.currentSong.id
      if (state.currentSong && state.currentSong.id) {
        // 根据后端文档，我们拼接URL。
        // 注意：后端说文件名是 {uuid}.ext，但没说扩展名是什么。
        // 我们暂时假设所有音频都是 .mp3 格式。如果不是，需要和后端同学确认。
        return `http://10.8.0.10:8080/static/audio/${state.currentSong.id}.mp3`;
      }
      return null;
    },
  },

  actions: {
    // --- 核心 Action，用于接收后端推送 ---
    setGlobalState(newState) {
      this.isPlaying = newState.isPlaying;
      this.currentSongId = newState.currentSongId;
      this.currentSong = newState.currentSong;
      this.playlist = newState.playlist;
      this.currentPlaylistIdx = newState.currentPlaylistIdx;
      this.progressMs = newState.progressMs;
      this.playMode = newState.playMode;
    },

    // --- 认证与连接 ---
    async validateTokenAndConnect(token) {
      try {
        const response = await api.validateToken(token);
        if (response.data.valid) {
          this.isAuthenticated = true;
          localStorage.setItem('jukebox_token', token); // 持久化token
          websocketService.connect();
          this.fetchLibrary(); // 连接成功后，获取一次媒体库
          return true;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
      }
      this.isAuthenticated = false;
      return false;
    },

    // --- 调用 HTTP API 的 Actions (Fire and Forget) ---
    play() { api.play(); },
    pause() { api.pause(); },
    next() { api.next(); },
    prev() { api.prev(); },
    seekTo(positionMs) {
      // "Fire and Forget"
      // 我们发送指令，然后等待 WebSocket 推送校准后的进度
      api.seek(positionMs);
    },

    async addToPlaylist(songId) {
      try {
        await api.addToPlaylist(songId);
        // 无需手动更新 state，等待 WebSocket 推送
      } catch (error) {
        console.error('Failed to add song to playlist:', error);
      }
    },

    async fetchLibrary() {
      try {
        const response = await api.getLibrary();
        this.mediaLibrary = response.data;
      } catch (error) {
        console.error('Failed to fetch library:', error);
      }
    },

    async uploadSong(file) {
      const formData = new FormData();
      formData.append('audioFile', file);
      try {
        await api.uploadSong(formData);
        this.fetchLibrary(); // 上传成功后刷新媒体库
      } catch (error) {
        console.error('Failed to upload song:', error);
      }
    },

    async removeSongFromLibrary(songId) {
      try {
        await api.removeSong(songId);
        // "Fire and Forget" - 无需手动修改 state
        // 后端会处理删除，并通过 WebSocket 推送最新的 mediaLibrary 和 playlist
      } catch (error) {
        console.error('Failed to remove song:', error);
        // 可以在此添加用户错误提示
      }
    },

    setLocalVolume(newVolume) {
      // 增加一个安全边界，确保音量值在 0 和 1 之间
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      
      this.localVolume = clampedVolume;
      
      // --- 新增：将新音量保存到 localStorage ---
      localStorage.setItem(VOLUME_STORAGE_KEY, clampedVolume.toString());
    },
  },
});
