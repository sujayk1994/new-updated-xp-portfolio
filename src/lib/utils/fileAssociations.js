import { winampStore } from '../stores/winampStore';

const AUDIO_EXTENSIONS = [
  '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', 
  '.wma', '.opus', '.webm', '.mid', '.midi'
];

const AUDIO_MIME_TYPES = [
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac',
  'audio/aac', 'audio/mp4', 'audio/webm', 'audio/midi'
];

export function isAudioFile(filename) {
  if (!filename) return false;
  const ext = '.' + filename.split('.').pop().toLowerCase();
  return AUDIO_EXTENSIONS.includes(ext);
}

export function isAudioMimeType(mimeType) {
  if (!mimeType) return false;
  return AUDIO_MIME_TYPES.includes(mimeType) || mimeType.startsWith('audio/');
}

export function getFileExtension(filename) {
  if (!filename) return '';
  return '.' + filename.split('.').pop().toLowerCase();
}

export function extractMetadata(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  if (nameWithoutExt.includes(' - ')) {
    const [artist, title] = nameWithoutExt.split(' - ', 2);
    return { artist: artist.trim(), title: title.trim() };
  }
  
  return { artist: 'Unknown Artist', title: nameWithoutExt };
}

export function createTrackFromFile(file, url) {
  const metadata = extractMetadata(file.name || file.filename || 'Unknown');
  
  return {
    metaData: {
      artist: metadata.artist,
      title: metadata.title
    },
    url: url || file.url || file.path,
    duration: file.duration || undefined
  };
}

export function openAudioFile(file, url) {
  const track = createTrackFromFile(file, url);
  
  winampStore.open();
  
  setTimeout(() => {
    winampStore.addTrack(track);
    winampStore.play();
  }, 500);
}

export function openAudioFiles(files) {
  const tracks = files.map(file => createTrackFromFile(file));
  
  winampStore.open();
  
  setTimeout(() => {
    winampStore.addTracks(tracks);
    winampStore.play();
  }, 500);
}

export function handleFileDoubleClick(file, options = {}) {
  const filename = file.name || file.filename || '';
  
  if (isAudioFile(filename)) {
    openAudioFile(file, options.url);
    return true;
  }
  
  return false;
}

export function getAudioIcon() {
  return '/icons/audio.png';
}

export function getWinampIcon() {
  return '/icons/winamp.png';
}

export const audioExtensions = AUDIO_EXTENSIONS;
export const audioMimeTypes = AUDIO_MIME_TYPES;
