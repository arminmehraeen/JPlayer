# JPlayer

A lightweight, modern JavaScript music player with a responsive UI and local music library support.

**Live Preview:** https://arminmehraeen.github.io/JPlayer/

## What's new

- Modern glassmorphism-inspired responsive player UI
- Dark / light theme with persisted preference
- Full playlist with active-track highlighting
- Select a local music folder and scan nested subfolders
- Drag & drop audio files into the playlist
- Reads title, artist, album, year and embedded cover art from audio metadata
- No separate cover-image folder is required for imported local music
- Automatic fallback artwork when a track has no embedded cover
- Shuffle and repeat modes
- Volume control and mute
- Playback speed selector
- Buffered playback indicator and improved seek bar
- Browser Media Session controls for supported browsers/devices
- Keyboard shortcuts for play/pause, seeking and next track
- Responsive mobile layout and accessibility labels
- Reduced-motion support
- JPlayer favicon

## Local music

Click **Music Folder** to select a folder. JPlayer scans the folder and its subfolders for supported audio files. In browsers that support the File System Access API, the folder can be selected directly; other browsers fall back to a multi-file picker.

Supported file types are MP3, WAV, OGG, M4A, AAC, FLAC and WebM, subject to browser playback support.

Embedded album artwork is read directly from the audio file. If artwork is missing, JPlayer generates a clean fallback cover automatically.

## Controls

| Action | Control |
| --- | --- |
| Play / Pause | Space |
| Seek | ← / → |
| Next track | N |
| Previous | Player button |
| Speed | 1× button |
| Shuffle | Shuffle button |
| Repeat | Repeat button |
| Theme | Moon / Sun button |
| Library | Music Folder / Drag & Drop |

## Project structure

```text
JPlayer/
├── index.html
├── style.css
├── script.js
├── favicon.svg
├── music/          # Optional bundled demo music
└── images/         # Optional legacy/demo artwork
```

## License

This project is open source. See the repository for license details.
