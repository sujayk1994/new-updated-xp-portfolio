// Winamp Helper - Microservice integration utility

export async function openInWinamp(filePath) {
  // Check if file is audio
  const audioExtensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];
  const isAudioFile = audioExtensions.some((ext) =>
    filePath.toLowerCase().endsWith(ext)
  );

  if (!isAudioFile) {
    console.warn('File is not an audio file:', filePath);
    return { status: 'error', message: 'Not an audio file' };
  }

  try {
    // Call Winamp API endpoint
    const response = await fetch('/api/winamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filePath, action: 'play' })
    });

    const result = await response.json();

    if (result.status === 'success') {
      // Dispatch global event for Winamp player to listen
      window.dispatchEvent(
        new CustomEvent('winamp-play-request', {
          detail: { file: filePath }
        })
      );
    }

    return result;
  } catch (error) {
    console.error('Winamp integration error:', error);
    return { status: 'error', message: error.message };
  }
}

export function isAudioFile(filename) {
  const audioExtensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];
  return audioExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

export function addWinampAudioListener(callback) {
  window.addEventListener('winamp-play-request', (event) => {
    callback(event.detail.file);
  });
}
