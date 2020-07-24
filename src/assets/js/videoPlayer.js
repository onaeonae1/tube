import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progressBar = document.getElementById("jsProgress");
const videoController = document.getElementById("jsVideoController");

let isWaiting;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};
function handleSpaceBar(event) {
  console.log(event.keyCode);
  if (event.keyCode === 32) {
    handlePlayClick();
  }
}
function hideMouse() {
  videoContainer.style.cursor = "none"; //커서 안보이게
  videoController.style.opacity = 0;
  clearTimeout(isWaiting);
}
function handleMouse() {
  clearTimeout(isWaiting);
  videoContainer.style.cursor = "pointer";
  videoController.style.opacity = 1;
  isWaiting = setTimeout(hideMouse, 4000);
}
function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}
function handleVolumeClick() {
  if (videoPlayer.muted) {
    //not read-only
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}
function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  videoPlayer.play();
}
function handleDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.5) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}
function handleProgress(event) {
  const {
    target: { value },
  } = event;
  const reqTime = value * (videoPlayer.duration / 100);
  videoPlayer.fastSeek(reqTime);
}
function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
}
function exitFullScreen() {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}
function getCurrentProgress() {
  const valTime = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.value = valTime;
}
async function setTotalTime() {
  console.log("measuring time..");
  const blob = await fetch(videoPlayer.src).then((response) => response.blob());
  const duration = await getBlobDuration(blob);
  console.log(duration);
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 500);
  setInterval(getCurrentProgress, 500);
}
function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  videoPlayer.addEventListener("mousemove", handleMouse);
  volumeRange.addEventListener("input", handleDrag);
  progressBar.addEventListener("input", handleProgress);
  //document.addEventListener("keydown", handleSpaceBar);
}
if (videoContainer) {
  init();
}
