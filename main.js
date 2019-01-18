const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const logoSrc = require("./logo.png");

// SNES-ish resolution
const width = 512;
const height = 384;

canvas.width = width;
canvas.height = height;

// Draw a bordered rectangle with a greeting
ctx.fillStyle = "#334";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw the logo
const logo = new Image();
logo.src = logoSrc;
logo.onload = () => {
  const scale = 5;
  const w = logo.width * scale;
  const h = logo.height * scale;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;
  const originalSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(logo, x, y, w, h);
  ctx.imageSmoothingEnabled = originalSmoothing;
};
