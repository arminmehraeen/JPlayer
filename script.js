const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const muteBtn = document.getElementById('mute');
const speedBtn = document.getElementById('speed');
const themeToggle = document.getElementById('theme-toggle');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const buffer = document.getElementById('buffer');
const progressContainer = document.getElementById('progress-container');
const progressThumb = document.querySelector('.progress-thumb');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');

const songs = ['Koonamoon', 'Begoo-Binam'];
const playbackRates = [1, 1.25, 1.5, 2, 0.75];
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
let lastVolume = 0.8;
let speedIndex = 0;

const formatTime = seconds => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

function loadSong(song) {
  title.textContent = song;
  audio.src = `music/${encodeURIComponent(song)}.mp3`;
  cover.src = `images/${encodeURIComponent(song)}.jpg`;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  progress.style.width = '0%';
  buffer.style.width = '0%';
}

async function playSong() {
  musicContainer.classList.add('play');
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  try { await audio.play(); } catch (error) { musicContainer.classList.remove('play'); console.warn('Playback was blocked:', error); }
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  audio.pause();
}

function nextSong() {
  if (isShuffle && songs.length > 1) {
    let next = songIndex;
    while (next === songIndex) next = Math.floor(Math.random() * songs.length);
    songIndex = next;
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function seek(clientX) {
  if (!Number.isFinite(audio.duration) || !progressContainer.clientWidth) return;
  const rect = progressContainer.getBoundingClientRect();
  const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  audio.currentTime = percent * audio.duration;
}

function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
  progressThumb.style.left = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
  progressContainer.setAttribute('aria-valuenow', percent.toFixed(0));
}

function updateBuffered() {
  if (!audio.duration || !audio.buffered.length) return;
  const end = audio.buffered.end(audio.buffered.length - 1);
  buffer.style.width = `${Math.min(100, (end / audio.duration) * 100)}%`;
}

playBtn.addEventListener('click', () => musicContainer.classList.contains('play') ? pauseSong() : playSong());
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('active', isShuffle); });
repeatBtn.addEventListener('click', () => { isRepeat = !isRepeat; repeatBtn.classList.toggle('active', isRepeat); });
repeatBtn.style.color = 'var(--muted)';

progressContainer.addEventListener('click', e => seek(e.clientX));
progressContainer.addEventListener('keydown', e => {
  if (!Number.isFinite(audio.duration)) return;
  if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('progress', updateBuffered);
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('ended', () => {
  if (isRepeat) { audio.currentTime = 0; playSong(); } else nextSong();
});
audio.addEventListener('play', () => musicContainer.classList.add('play'));
audio.addEventListener('pause', () => musicContainer.classList.remove('play'));

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
  if (audio.volume > 0) lastVolume = audio.volume;
  muteBtn.innerHTML = `<i class="fa-solid ${audio.volume === 0 ? 'fa-volume-xmark' : audio.volume < .5 ? 'fa-volume-low' : 'fa-volume-high'}"></i>`;
});
muteBtn.addEventListener('click', () => {
  if (audio.volume > 0) { lastVolume = audio.volume; audio.volume = 0; volume.value = 0; }
  else { audio.volume = lastVolume || .8; volume.value = audio.volume; }
  muteBtn.click = null;
  muteBtn.innerHTML = `<i class="fa-solid ${audio.volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
});

speedBtn.addEventListener('click', () => {
  speedIndex = (speedIndex + 1) % playbackRates.length;
  const rate = playbackRates[speedIndex];
  audio.playbackRate = rate;
  speedBtn.textContent = `${rate}×`;
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const light = document.body.classList.contains('light');
  themeToggle.innerHTML = `<i class="fa-solid ${light ? 'fa-sun' : 'fa-moon'}"></i>`;
  localStorage.setItem('jplayer-theme', light ? 'light' : 'dark');
});
if (localStorage.getItem('jplayer-theme') === 'light') themeToggle.click();

window.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); musicContainer.classList.contains('play') ? pauseSong() : playSong(); }
  if (e.key.toLowerCase() === 'n') nextSong();
  if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 5);
  if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
});

loadSong(songs[songIndex]);
audio.volume = Number(volume.value);