import { writable, get } from 'svelte/store';

function createWinampStore() {
  const { subscribe, set, update } = writable({
    isOpen: false,
    isMinimized: false,
    webampInstance: null,
    currentTrack: null,
    playlist: [],
    volume: 80,
    isPlaying: false,
    position: { x: 100, y: 100 },
    zIndex: 1000
  });

  return {
    subscribe,
    
    open: () => update(state => ({ ...state, isOpen: true, isMinimized: false })),
    
    close: () => update(state => ({ ...state, isOpen: false })),
    
    minimize: () => update(state => ({ ...state, isMinimized: true })),
    
    restore: () => update(state => ({ ...state, isMinimized: false })),
    
    toggle: () => update(state => ({ 
      ...state, 
      isOpen: !state.isOpen,
      isMinimized: false 
    })),
    
    setInstance: (instance) => update(state => ({ ...state, webampInstance: instance })),
    
    setPosition: (x, y) => update(state => ({ 
      ...state, 
      position: { x, y } 
    })),
    
    bringToFront: (zIndex) => update(state => ({ ...state, zIndex })),
    
    setPlaylist: (playlist) => update(state => ({ ...state, playlist })),
    
    addTrack: (track) => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.appendTracks([track]);
      }
      update(s => ({ ...s, playlist: [...s.playlist, track] }));
    },
    
    addTracks: (tracks) => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.appendTracks(tracks);
      }
      update(s => ({ ...s, playlist: [...s.playlist, ...tracks] }));
    },
    
    clearPlaylist: () => {
      update(state => ({ ...state, playlist: [] }));
    },
    
    play: () => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.play();
        update(s => ({ ...s, isPlaying: true }));
      }
    },
    
    pause: () => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.pause();
        update(s => ({ ...s, isPlaying: false }));
      }
    },
    
    stop: () => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.stop();
        update(s => ({ ...s, isPlaying: false }));
      }
    },
    
    nextTrack: () => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.nextTrack();
      }
    },
    
    previousTrack: () => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.previousTrack();
      }
    },
    
    setVolume: (volume) => {
      const state = get({ subscribe });
      if (state.webampInstance) {
        state.webampInstance.setVolume(volume);
      }
      update(s => ({ ...s, volume }));
    },
    
    setCurrentTrack: (track) => update(state => ({ ...state, currentTrack: track })),
    
    openWithFile: (file) => {
      update(state => ({ ...state, isOpen: true, isMinimized: false }));
    },
    
    openWithFiles: (files) => {
      update(state => ({ ...state, isOpen: true, isMinimized: false }));
    }
  };
}

export const winampStore = createWinampStore();
