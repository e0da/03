const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Draw a bordered rectangle with a greeting
const borderWidth = 10;
ctx.fillStyle = "#222";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#334";
ctx.fillRect(
  borderWidth,
  borderWidth,
  canvas.width - borderWidth * 2,
  canvas.height - borderWidth * 2
);
ctx.fillStyle = "cyan";
ctx.font = "50px sans-serif";
ctx.fillText("hullo", 80, canvas.height / 2 + 15);
