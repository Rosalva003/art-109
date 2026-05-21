const nodes = [];
const edges = [];

let activeMode = "draw";
let selectedNode = null;
let draggedNode = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

let colorInput;
let sizeInput;
let nodeCountEl;
let edgeCountEl;
let statusTextEl;
let modeButtons;

function setup() {
  const holder = document.getElementById("canvas-holder");
  const canvas = createCanvas(holder.clientWidth, holder.clientHeight);
  canvas.parent("canvas-holder");

  colorInput = document.getElementById("nodeColor");
  sizeInput = document.getElementById("nodeSize");
  nodeCountEl = document.getElementById("nodeCount");
  edgeCountEl = document.getElementById("edgeCount");
  statusTextEl = document.getElementById("statusText");
  modeButtons = document.querySelectorAll(".mode-button");

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  document.getElementById("clearButton").addEventListener("click", clearDrawing);
  document.getElementById("saveButton").addEventListener("click", () => {
    saveCanvas("node-drawing", "png");
  });

  seedDrawing();
  updateStats();
}

function draw() {
  background("#fffdfd");
  drawGridDots();
  drawEdges();
  drawNodes();
}

function mousePressed() {
  if (!isInsideCanvas()) {
    return;
  }

  const node = getNodeAt(mouseX, mouseY);

  if (activeMode === "connect") {
    handleConnect(node);
    return;
  }

  if (activeMode === "erase") {
    eraseAtPointer(node);
    return;
  }

  if (node) {
    draggedNode = node;
    dragOffsetX = node.x - mouseX;
    dragOffsetY = node.y - mouseY;
    return;
  }

  nodes.push(createNode(mouseX, mouseY));
  updateStats();
  setStatus("Node added. Drag it to fine-tune the drawing.");
}

function mouseDragged() {
  if (activeMode !== "draw" || !draggedNode) {
    return;
  }

  draggedNode.x = constrain(mouseX + dragOffsetX, draggedNode.r, width - draggedNode.r);
  draggedNode.y = constrain(mouseY + dragOffsetY, draggedNode.r, height - draggedNode.r);
}

function mouseReleased() {
  draggedNode = null;
}

function doubleClicked() {
  if (!isInsideCanvas() || activeMode !== "draw") {
    return;
  }

  const node = getNodeAt(mouseX, mouseY);

  if (node) {
    node.color = colorInput.value;
    node.r = Number(sizeInput.value) / 2;
    setStatus("Node style updated.");
  }
}

function windowResized() {
  const holder = document.getElementById("canvas-holder");
  resizeCanvas(holder.clientWidth, holder.clientHeight);

  nodes.forEach((node) => {
    node.x = constrain(node.x, node.r, width - node.r);
    node.y = constrain(node.y, node.r, height - node.r);
  });
}

function setMode(mode) {
  activeMode = mode;
  selectedNode = null;

  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  if (mode === "connect") {
    setStatus("Connect mode: click one node, then another node.");
  } else if (mode === "erase") {
    setStatus("Erase mode: click a node or link to remove it.");
  } else {
    setStatus("Add / Move mode: click the canvas to add nodes.");
  }
}

function handleConnect(node) {
  if (!node) {
    selectedNode = null;
    setStatus("Choose a node to start a connection.");
    return;
  }

  if (!selectedNode) {
    selectedNode = node;
    setStatus("Now choose another node to complete the link.");
    return;
  }

  if (selectedNode.id === node.id) {
    selectedNode = null;
    setStatus("Pick two different nodes to make a link.");
    return;
  }

  const edgeExists = edges.some((edge) => {
    return (
      (edge.from === selectedNode.id && edge.to === node.id) ||
      (edge.from === node.id && edge.to === selectedNode.id)
    );
  });

  if (!edgeExists) {
    edges.push({ from: selectedNode.id, to: node.id });
    updateStats();
    setStatus("Nodes connected.");
  } else {
    setStatus("Those nodes are already connected.");
  }

  selectedNode = null;
}

function eraseAtPointer(node) {
  if (node) {
    removeNode(node.id);
    setStatus("Node erased.");
    return;
  }

  const edgeIndex = getEdgeIndexAt(mouseX, mouseY);

  if (edgeIndex >= 0) {
    edges.splice(edgeIndex, 1);
    updateStats();
    setStatus("Link erased.");
  }
}

function removeNode(nodeId) {
  const nodeIndex = nodes.findIndex((node) => node.id === nodeId);

  if (nodeIndex >= 0) {
    nodes.splice(nodeIndex, 1);
  }

  for (let index = edges.length - 1; index >= 0; index -= 1) {
    if (edges[index].from === nodeId || edges[index].to === nodeId) {
      edges.splice(index, 1);
    }
  }

  if (selectedNode && selectedNode.id === nodeId) {
    selectedNode = null;
  }

  updateStats();
}

function clearDrawing() {
  nodes.length = 0;
  edges.length = 0;
  selectedNode = null;
  updateStats();
  setStatus("Canvas cleared. Add a fresh set of nodes.");
}

function seedDrawing() {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = min(width, height) * 0.24;
  const seedColors = ["#ff7ab6", "#9c4cff", "#57c7ff", "#ffd166", "#7bd88f"];

  for (let index = 0; index < 5; index += 1) {
    const angle = -HALF_PI + (TWO_PI / 5) * index;
    nodes.push({
      id: createNodeId(),
      x: centerX + cos(angle) * radius,
      y: centerY + sin(angle) * radius,
      r: 18,
      color: seedColors[index],
    });
  }

  edges.push(
    { from: nodes[0].id, to: nodes[2].id },
    { from: nodes[2].id, to: nodes[4].id },
    { from: nodes[4].id, to: nodes[1].id },
    { from: nodes[1].id, to: nodes[3].id },
    { from: nodes[3].id, to: nodes[0].id },
  );
}

function createNode(x, y) {
  const radius = Number(sizeInput.value) / 2;

  return {
    id: createNodeId(),
    x: constrain(x, radius, width - radius),
    y: constrain(y, radius, height - radius),
    r: radius,
    color: colorInput.value,
  };
}

function drawGridDots() {
  noStroke();
  fill(52, 35, 79, 22);

  for (let x = 16; x < width; x += 32) {
    for (let y = 16; y < height; y += 32) {
      circle(x, y, 2);
    }
  }
}

function drawEdges() {
  strokeWeight(5);
  strokeCap(ROUND);

  edges.forEach((edge) => {
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);

    if (!from || !to) {
      return;
    }

    stroke(52, 35, 79, 95);
    line(from.x, from.y, to.x, to.y);
    stroke(255, 255, 255, 105);
    strokeWeight(2);
    line(from.x, from.y, to.x, to.y);
    strokeWeight(5);
  });
}

function drawNodes() {
  nodes.forEach((node) => {
    const isSelected = selectedNode && selectedNode.id === node.id;

    noStroke();
    fill(52, 35, 79, 35);
    circle(node.x + 5, node.y + 7, node.r * 2.2);

    stroke(isSelected ? "#34234f" : "#ffffff");
    strokeWeight(isSelected ? 5 : 3);
    fill(node.color);
    circle(node.x, node.y, node.r * 2);

    noStroke();
    fill(255, 255, 255, 125);
    circle(node.x - node.r * 0.25, node.y - node.r * 0.25, node.r * 0.62);
  });
}

function getNodeAt(x, y) {
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index];

    if (dist(x, y, node.x, node.y) <= node.r) {
      return node;
    }
  }

  return null;
}

function getEdgeIndexAt(x, y) {
  for (let index = edges.length - 1; index >= 0; index -= 1) {
    const edge = edges[index];
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);

    if (!from || !to) {
      continue;
    }

    if (distanceToSegment(x, y, from.x, from.y, to.x, to.y) < 8) {
      return index;
    }
  }

  return -1;
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const segmentLengthSquared = sq(x2 - x1) + sq(y2 - y1);

  if (segmentLengthSquared === 0) {
    return dist(px, py, x1, y1);
  }

  const amount = constrain(
    ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / segmentLengthSquared,
    0,
    1,
  );

  const x = x1 + amount * (x2 - x1);
  const y = y1 + amount * (y2 - y1);

  return dist(px, py, x, y);
}

function isInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function createNodeId() {
  return `node-${Date.now()}-${Math.floor(random(1000000))}`;
}

function updateStats() {
  nodeCountEl.textContent = `${nodes.length} ${nodes.length === 1 ? "node" : "nodes"}`;
  edgeCountEl.textContent = `${edges.length} ${edges.length === 1 ? "link" : "links"}`;
}

function setStatus(message) {
  statusTextEl.textContent = message;
}
