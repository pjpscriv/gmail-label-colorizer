// More Gmail Label Colors Script
// Constants
const LOG_PREFIX = "[MORE GMAIL LABEL COLORS]";
const ATTR_NAME = "data-inject-content-controller";
const CHILD_QUERY = "div:not([jsaction]) > div [data-bg-color]";
const TABLE_QUERY = "[data-bg-color] > table";
const TBODY_QUERY = "[data-bg-color] > table > tbody";

// Functions
// https://stackoverflow.com/a/41491220/13762264
function colorIsDark(bgColor) {
  let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  let L = (r * 0.299) + (g * 0.587) + (b * 0.114);
  return L <= 186;
}

Coloris({
  alpha: false,
  swatches: [

    // Row 1
    "#ad1457", // Beetroot
    "#F4511E", // Tangerine
    "#e4c441", // Citron
    "#0b8043", // Basil
    "#3F51B5", // Blueberry
    "#8E24AA",  // Grape

    // Row 2
    "#d81b60", // Cherry Blossom
    "#ef6c00", // Pumpkin
    "#C0CA33", // Avocado
    "#009688", // Ecualyptus
    "#7986cb", // Lavender
    "#795548", // Cocoa

    // Row 3
    "#D50000", // Tomato
    "#f09300", // Mango
    "#7cb342", // Pistachio
    "#039BE5", // Peacock
    "#b39ddb", // Wisisteria
    "#616161", // Graphite

    // Row 4
    "#e67c73", // Flamingo
    "#F6BF26", // Banana
    "#33B679", // Sage
    "#4285f4", // Cobalt
    "#9E69AF", // Amethyst
    "#a79b8e", // Birch
  ]
})

const tableHeadSelector = (n) => `[data-bg-color] > table > tbody > tr:nth-child(1) > td:nth-child(${n})`;
const tableColSelector = (n) => `[data-bg-color] > table > tbody > tr:nth-child(2) > td:nth-child(${n})`;


function transformModal(node) {
  const child = node.querySelector(CHILD_QUERY);
  if (!child)
    return;

  const table = child.querySelector(TABLE_QUERY);
  const tbody = child.querySelector(TBODY_QUERY);

  // --------- Text color ---------
  const txtColorCol = child.querySelector(tableColSelector(3));
  
  // 0. Get highlight config
  const txtCells = Array.from(txtColorCol.querySelectorAll("td"));
  if (txtCells.length === 0) {
      const delay = 500; 
      console.log(LOG_PREFIX, `No text cells found. This usually happens the first time the modal is opened. Retrying in ${delay}ms`);
      setTimeout(() => transformModal(node), delay);
      return;
  }
  const txtCellMap = txtCells.reduce((acc, n) => {
      if (acc[n.classList] === undefined) {
          acc[n.classList] = [];
      }
      acc[n.classList].push(n);
      return acc;
  }, {});
  const txtUnselected = Object.keys(txtCellMap)
      .map(k => txtCellMap[k].length > 1 ? { class: k, nodes: txtCellMap[k] } : null )
      .filter(x => x !== null)[0];
  const txtSelected = Object.keys(txtCellMap)
      .map(k => txtCellMap[k].length === 1 ? { class: k, node: txtCellMap[k][0] } : null)
      .filter(x => x !== null)[0];
  
  // 1. Get selected box
  const txtTickNode = txtSelected?.node?.querySelector("div");
  const labelTxtNode = child.querySelector("div [title][style] div div");

  /*
  console.log("Important TXT nodes:");
  console.log(txtTickNode);
  /* */
  
  // 2. Delete all other boxes
  txtUnselected?.nodes?.forEach(n => n.remove());
  const txtRows = Array.from(txtColorCol.querySelectorAll("div > div"));
  txtRows.forEach(r => r.style = "display: flex; justify-content: center;");
  
  
  // --------- Background color ---------
  const bgColorCol = child.querySelector(tableColSelector(1));
  
  // 0. Get highlight config
  const bgCells = Array.from(bgColorCol.querySelectorAll("td"));
  const bgCellMap = bgCells.reduce((acc, n) => {
      if (acc[n.classList] === undefined) {
          acc[n.classList] = [];
      }
      acc[n.classList].push(n);
      return acc;
  }, {});
  const bgUnselected = Object.keys(bgCellMap)
      .map(k => bgCellMap[k].length > 1 ? { class: k, nodes: bgCellMap[k] } : null )
      .filter(x => x !== null)[0];
  const bgSelected = Object.keys(bgCellMap)
      .map(k => bgCellMap[k].length === 1 ? { class: k, node: bgCellMap[k][0] } : null)
      .filter(x => x !== null)[0];
  
  // 1. Get selected box
  const bgTickNode = bgSelected.node.querySelector("div");
  const labelNode = child.querySelector("div [title][style]");

  const initialColor = labelNode.style.backgroundColor;
  console.log(initialColor);


  /*
  console.log("Important BG nodes:")
  console.log(bgSelected.node);
  console.log(bgTickNode);
  console.log(labelNode);
  /* */
  
  // 2. Delete all other boxes
  bgUnselected?.nodes?.forEach(n => n.remove());
  const bgRows = Array.from(bgColorCol.querySelectorAll("div > div"));
  bgRows.forEach(r => r.style = "display: flex; justify-content: center;");
  
  // 3. Add in color querySelector
  const bgInner = bgColorCol.querySelector("div");
  
  // 3.1 Remove previous color inputs
  bgInner.querySelectorAll("input[type=color]").forEach(n => n.remove());
  
  // 3.2 Add color input to node
  const clrNode = document.createElement("div");
  clrNode.classList.add("clr-field");

  const clrBtn = document.createElement("button");
  clrBtn.classList.add("clr-open-label");

  const colorInput = document.createElement("input");
  colorInput.type = "text";
  colorInput.classList.add("input100");
  colorInput.classList.add("underline-color");
  colorInput.setAttribute("data-coloris", "");
  colorInput.value = bgInner.style.backgroundColor;
  colorInput.style = "width: 100%; height: 2em; border-width: 0;";
  colorInput.addEventListener("input", () => {
    // Label color
    bgSelected.node.ariaLabel = colorInput.value;
    bgTickNode.style.backgroundColor = colorInput.value;
    labelNode.style.backgroundColor = colorInput.value;
    clrNode.style.color = colorInput.value;

    // Text color
    const txtColor = colorIsDark(colorInput.value) ? "#ffffff" : "#000000";
    txtTickNode.style.backgroundColor = txtColor;
    labelTxtNode.style.color = txtColor;
  });

  clrNode.appendChild(clrBtn);
  clrNode.appendChild(colorInput);
  tbody.appendChild(clrNode);
  
  // 3.3 Set first color = hot pink
  // colorInput.value = "#ff69b4";
  // colorInput.value = initialColor;
  // colorInput.dispatchEvent(new Event("input"));

  // 4. Hide whole column
  // 4.1 Hide headers
  for (let i = 1; i <= 3; i++) {
    const header = child.querySelector(tableHeadSelector(i));
    header.style.display = "none";
  }

  // 4.2 Hide spacer & text color column
  bgColorCol.style.display = "none";
  const spacerCol = child.querySelector(tableColSelector(2));
  spacerCol.style.display = "none";
  txtColorCol.style.display = "none";

  // 4.3 Fix up alignment
  table.style = "display: flex; justify-content: center; padding: 1em;";
  tbody.style = "display: table; width: 33%;";

}


function mutationHandler(mutations) {
  mutations.forEach((m) => {
    m.addedNodes.forEach((node) => {
      if (node.nodeType !== 1)
        return;
      if (!node.hasAttribute(ATTR_NAME) || node.getAttribute(ATTR_NAME) !== "true")
        return;
      transformModal(node);
    });
  });
}

console.log(LOG_PREFIX, "Content script loaded");

console.log(LOG_PREFIX, "Starting observer");
const observer = new MutationObserver(mutationHandler);
const observerConfig = { childList: true, subtree: true };
observer.observe(document.body, observerConfig);
