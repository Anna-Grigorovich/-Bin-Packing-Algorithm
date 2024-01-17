fetch("./input.json")
  .then((response) => response.json())
  .then((json) => {
    let packer = new BinPacking(600, 600);

    packer.pack(json.WH);
    renderBlocks(packer.root, json.WH);

    const container = document.getElementById("container");
    container.style.width = packer.root.w + "px";
    container.style.height = packer.root.h + "px";

    const optimalLayoutInfo = packer.getOptimalLayoutInfo(json.WH);
    console.log("Optimal Layout Information:", optimalLayoutInfo);
    renderUtilizationInfo(optimalLayoutInfo.fullness);
  });

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function renderBlocks(root, rectangles) {
  const container = document.getElementById("container");

  rectangles.forEach((rect) => {
    if (rect.fit) {
      const blockElement = document.createElement("div");
      blockElement.className = "block";
      blockElement.style.width = rect.width + "px";
      blockElement.style.height = rect.height + "px";
      blockElement.style.top = rect.fit.y + "px";
      blockElement.style.left = rect.fit.x + "px";
      blockElement.style.backgroundColor = getRandomColor();
      blockElement.innerText = rect.fit ? "Fitted" : "Not Fitted";
      container.appendChild(blockElement);
    } else {
      console.log("not fitted", rect);
    }
  });
}
function renderUtilizationInfo(fullness) {
  const utilizationInfoElement = document.getElementById("utilizationInfo");
  utilizationInfoElement.innerText = `Fullness: ${fullness}`;
}
