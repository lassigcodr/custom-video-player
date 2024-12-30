"use strict";

const controls = document.querySelector("#controls");
const playNpauseBtn = document.querySelector("#play-pause");
const video = document.querySelector("video");
const rewindBtn = document.querySelector("#rewind");
const fastForwardBtn = document.querySelector("#fast-forward");
const volumeBtn = document.querySelector("#volume");
const progressIndicator = document.querySelector("#progress-indicator");
const progessBar = document.querySelector("#progress-bar");
const fullscreen = document.querySelector("#fullscreen");
const volumeBar = document.querySelector("#volume-bar");
const volumeIndicator = document.querySelector("#volume-indicator");
const playbackContainer = document.querySelector('#playback-container');
const playbackMenu = document.querySelector('#playback-menu');
const playbackRate = document.querySelector('#playback-display');

const showPlaybackOptions = function() {
  playbackMenu.classList.toggle('invisible');
}

const playbackRateFn = function(e) {
  const speed = e.target;
  video.playbackRate = parseFloat(speed.dataset.rate);
  playbackRate.innerHTML = speed.innerHTML;
}

const playNpauseFn = function() {
  video.paused ? video.play() : video.pause();
}

const updatePlayNpauseIcon = function() {
  const icon = playNpauseBtn.querySelector("i");
  icon.textContent = "";

  icon.textContent = video.paused ? "play_arrow" : "paused";
}

const rewindNforwardFn = function(type) {
  video.currentTime += type === "rewind" ? -10 : 10;
}

const muteNunmuteFn = function() {
  video.muted = video.muted ? false : true;
}

const updateVolumeIcon = function() {
  const icon = volumeBtn.querySelector("i");
  icon.textContent = "";
  icon.textContent = video.muted ? "volume_off" : "volume_up";
}

const updateProgress = function() {
  const progressPercentage = (video.currentTime / video.duration) * 100;

  progressIndicator.style.width = `${progressPercentage}%`;
}

const seekingFn = function(e) {
  const updatedTime = (e.offsetX / progessBar.offsetWidth) * video.duration;

  video.currentTime = updatedTime;
}

const toggleFullscreenFn = function() {
  if(!document.fullscreenElement) {
    video.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enter fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

const updateFullscreenIcon = function() {
  const icon = fullscreen.querySelector("i");
  icon.textContent = "";
  icon.textContent = !document.fullscreenElement ? "fullscreen" : "fullscreen_exit";
}

const updateVolumeBar = function() {
  const volumePercentage = video.volume * 100;
  volumeIndicator.style.width =`${volumePercentage}%`;
}

const volumeFn = function(e) {
  let updateVolume = Math.round((e.offsetX / volumeBar.offsetWidth) * 100) / 100;
  video.volume = updateVolume;
  
  if(video.volume === 0) {
    video.muted = true;
    updateVolumeIcon();
  }

  updateVolumeBar();
}

video.addEventListener('play', updatePlayNpauseIcon);
video.addEventListener('click', playNpauseFn);
video.addEventListener('pause', updatePlayNpauseIcon);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('timeupdate', updateProgress);

playNpauseBtn.addEventListener('click', playNpauseFn);
rewindBtn.addEventListener('click', () => rewindNforwardFn("rewind"));
fastForwardBtn.addEventListener('click', () => rewindNforwardFn("forward"));
volumeBtn.addEventListener('click', muteNunmuteFn);
volumeBar.addEventListener('click', volumeFn);

playbackContainer.addEventListener('click', showPlaybackOptions);
playbackMenu.addEventListener('click', playbackRateFn)

updateVolumeBar()

fullscreen.addEventListener('click', toggleFullscreenFn);
fullscreen.addEventListener('click', updateFullscreenIcon);

// Adding the seek functionality
let mouseIsDown = false;

progessBar.addEventListener('mousedown', () => seekingFn(mouseIsDown = true));
progessBar.addEventListener('mouseup', () => (mouseIsDown = false));
progessBar.addEventListener('click', seekingFn);
progessBar.addEventListener('mousemove', (e) => mouseIsDown && seekingFn);


window.addEventListener('keyup', (e) => {
  if(e.code === "Space") {
    playNpauseFn();
  } else if(e.code === "ArrowLeft") {
    rewindNforwardFn("rewind");
  } else if(e.code === "ArrowRight") {
    rewindNforwardFn("forward");
  } else {
    return;
  }
})