const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");
const videoUpload = document.getElementById("jsVideoUpload");
let streamObject;
let videoRecorder;
const handleVideoData = (event) => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click(); //faking click
};
const stopRecording = () => {
  videoPreview.pause();
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start Recording";
};
const startRecording = async () => {
  //console.log(streamObject);
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};
const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 640, height: 360 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    streamObject = stream;
    recordBtn.innerHTML = "Stop Recording";
    startRecording();
  } catch (error) {
    recordBtn.innerHTML = "Cant Record";
    recordBtn.style.backgroundColor = "#DC143C";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
};
const getUpload = () => {
  videoUpload.style.display = "none";
  const formcontainer = document.getElementById("jsFormContainer");
  const span1 = document.createElement("span");
  span1.innerHTML = "FILE UPLOADING. PLEASE WAIT";
  formcontainer.appendChild(span1);
};
function init() {
  recordBtn.addEventListener("click", getVideo);
  videoUpload.addEventListener("submit", getUpload);
}

if (recorderContainer) {
  init();
}
