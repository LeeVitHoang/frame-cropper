const videoInput = document.getElementById("videoInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let video = document.createElement("video");
video.crossOrigin = "anonymous";

let randomTime = 0;

// crop frame
function drawFrame() {
  if (!video.videoWidth) return;

  // set canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let zoom = Number(document.getElementById("zoom").value);
  let rotation =
    (Number(document.getElementById("rotation").value) * Math.PI) / 180;
  let vignette = Number(document.getElementById("vignette").value);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation);
  ctx.scale(zoom, zoom);

  ctx.drawImage(
    video,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  ctx.restore();

  // vig
  if (vignette > 0) {
    let gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.1,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.6
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${vignette})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function pickRandomFrame() {
  if (!video.duration) return;
  randomTime = Math.random() * video.duration;
  video.currentTime = randomTime;
}

video.addEventListener("seeked", drawFrame);

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (!file) return;

  video.src = URL.createObjectURL(file);

  video.onloadedmetadata = () => {
    pickRandomFrame();
  };
});

// slider
document.querySelectorAll("input[type=range]").forEach((slider) => {
  slider.addEventListener("input", drawFrame);
});

document.getElementById("randomBtn").addEventListener("click", pickRandomFrame);

document.getElementById("downloadBtn").addEventListener("click", () => {
  // png
  const link = document.createElement("a");
  link.download = "frame.png";
  link.href = canvas.toDataURL("image/png"); // PNG giữ nét
  link.click();
});

// zoom
const zoomSlider = document.getElementById("zoom");
const zoomNumber = document.getElementById("zoomNumber");

zoomSlider.addEventListener("input", () => {
  zoomNumber.value = zoomSlider.value;
  drawFrame();
});

zoomNumber.addEventListener("input", () => {
  zoomSlider.value = zoomNumber.value;
  drawFrame();
});

// rotation
const rotationSlider = document.getElementById("rotation");
const rotationNumber = document.getElementById("rotationNumber");

rotationSlider.addEventListener("input", () => {
  rotationNumber.value = rotationSlider.value;
  drawFrame();
});

rotationNumber.addEventListener("input", () => {
  rotationSlider.value = rotationNumber.value;
  drawFrame();
});

// vignette
const vignetteSlider = document.getElementById("vignette");
const vignetteNumber = document.getElementById("vignetteNumber");

vignetteSlider.addEventListener("input", () => {
  vignetteNumber.value = vignetteSlider.value;
  drawFrame();
});

vignetteNumber.addEventListener("input", () => {
  vignetteSlider.value = vignetteNumber.value;
  drawFrame();
});
