// Gmail Label Colorizer Script

// ------------------------------- CONSTANTS -------------------------------- //
const LOG_PREFIX = "[GMAIL-LABEL-COLORIZER-EXTN]";
const MODAL_ATTR = "data-inject-content-controller";
const MODAL_CONTENT_QUERY = "div:not([jsaction]) > div [data-bg-color]";
const TABLE_QUERY = "[data-bg-color] > table";
const TBODY_QUERY = "[data-bg-color] > table > tbody";
const CURRENT_LABEL_QUERY = "[role=menu] > [role=menuitem] > div > span > span";
const FIRST_OPEN_DELAY = 50;

const EXTN_ENABLED = true;



// ---------------------------- HELPER FUNCTIONS ---------------------------- //
/* Determine if a color is dark or light. From: https://stackoverflow.com/a/41491220/13762264 */
function colorIsDark(bgColor) {
  let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  let L = (r * 0.299) + (g * 0.587) + (b * 0.114);
  return L <= 186;
}

/* Convert "rgb(r, g, b)" to "#rrggbb" */
function rgbStringToHex(rgbStr) {
  const rgb = rgbStr.slice(4, -1).split(', ').map(x => parseInt(x));
  const rgbHex = rgb.map(x => { const hex = x.toString(16); return hex.length === 1 ? '0' + hex : hex; }).join('');
  return '#' + rgbHex;
}

/* Given a list of table cells, split them into the selected cell and the rest */
function getCellsBySelected(cells) {
  // Group cells by class
  const cellMap = cells.reduce((acc, node) => {
    const className = node.className;
    acc[className] = acc[className] ? [...acc[className], node] : [node];
    return acc;
  }, {});
  
  // The selected cell will be the only one with a unique class
  const selected = Object.keys(cellMap)
    .map(k => cellMap[k].length === 1 ? { class: k, node: cellMap[k][0] } : null)
    .filter(x => x !== null)[0];

  // All other (unselected) cells have the same class
  const unselected = Object.keys(cellMap)
    .map(k => cellMap[k].length > 1 ? { class: k, nodes: cellMap[k] } : null )
    .filter(x => x !== null)[0];

  return { selected, unselected };
}

/* Setup Coloris input with desired settings and callback for input changes */
function setupColorInput(parentEl, buttonEl, inputEl, callback, initColor) {
  parentEl.classList.add("clr-field");
  buttonEl.classList.add("clr-open-label");

  inputEl.type = "text";
  inputEl.classList.add("input100");
  inputEl.classList.add("underline-color");
  inputEl.setAttribute("data-coloris", "");
  inputEl.style = "width: 100%; height: 2em; border-width: 0;";
  inputEl.addEventListener("input", callback);

  parentEl.appendChild(buttonEl);
  parentEl.appendChild(inputEl);

  // Set initial color
  inputEl.value = initColor;
  inputEl.dispatchEvent(new Event("input"));
}

/* Selectors for table headers and columns */
const tableHeadSelector = (n) => `[data-bg-color] > table > tbody > tr:nth-child(1) > td:nth-child(${n})`;
const tableColSelector = (n) => `[data-bg-color] > table > tbody > tr:nth-child(2) > td:nth-child(${n})`;

/* Coloris initialization. Assumes prescence of Coloris JS & CSS. */
Coloris({
  alpha: false,
  swatches: [
    // Row 1 - Beetroot, Tangerine, Citron, Basil, Blueberry, Grape
    "#AD1457", "#F4511E", "#E4C441", "#0B8043", "#3F51B5", "#8E24AA", 
    // Row 2 - Cherry Blossom, Pumpkin, Avocado, Ecualyptus, Lavender, Cocoa
    "#D81B60", "#EF6C00", "#C0CA33", "#009688", "#7986CB", "#795548", 
    // Row 3 - Tomato, Mango, Pistachio, Peacock, Wisisteria, Graphite
    "#D50000", "#F09300", "#7CB342", "#039BE5", "#B39DDB", "#616161", 
    // Row 4 - Flamingo, Banana, Sage, Cobalt, Amethyst, Birch
    "#E67C73", "#F6BF26", "#33B679", "#4285F4", "#9E69AF", "#A79B8E", 
  ]
})



// --------------------------- MAIN FUNCTIONALITY --------------------------- //
/* Transform the modal to add color picker and remove unneeded options */
function transformModal(node) {
  const modalContent = node.querySelector(MODAL_CONTENT_QUERY);
  if (!modalContent)
    return;

  // Get elements
  // const table = modalContent.querySelector(TABLE_QUERY);
  const tbody = modalContent.querySelector(TBODY_QUERY);
  const currentColorEl = document.querySelector(CURRENT_LABEL_QUERY);

  const bgColorCol = modalContent.querySelector(tableColSelector(1));
  const spacerCol = modalContent.querySelector(tableColSelector(2));
  const txtColorCol = modalContent.querySelector(tableColSelector(3));


  // --------------- "Auto-set text color" checkbox ---------------
  const checkboxLabelEl = document.createElement("label");
  const checkboxInputEl = document.createElement("input");
  const checkboxSpanEl = document.createElement("span");
  checkboxLabelEl.classList.add("pure-material-checkbox");
  checkboxInputEl.type = "checkbox";
  checkboxInputEl.checked = false;
  // TODO: Find a way to change this by language
  checkboxSpanEl.textContent = "Auto-set text color";
  
  checkboxLabelEl.appendChild(checkboxInputEl);
  checkboxLabelEl.appendChild(checkboxSpanEl);


  // --------------- Text color ---------------
  // 0. Get text color cells
  const txtCellList = Array.from(txtColorCol.querySelectorAll("td"));
  
  // 0.5 Check cells exist, if not, retry after a delay
  if (txtCellList.length === 0) {
      console.log(LOG_PREFIX, `No text cells found. This usually happens the first time the modal is opened. Retrying in ${FIRST_OPEN_DELAY}ms`);
      setTimeout(() => transformModal(node), FIRST_OPEN_DELAY);
      return;
  }

  // 1. Group text cells by class
  const txtCells = getCellsBySelected(txtCellList)
  
  // 2. Get selected box
  const txtTickNode = txtCells?.selected?.node?.querySelector("div");
  
  // 3. Delete all other boxes
  txtCells?.unselected?.nodes?.forEach(n => n.remove());

  // 4. Center the remaining box
  // TODO: This might not be needed
  const txtRows = Array.from(txtColorCol.querySelectorAll("div > div"));
  txtRows.forEach(r => r.style = "display: flex; justify-content: center;");

  // 5. Get node that displays the text color
  const labelTxtNode = modalContent.querySelector("div [title][style] div div");

  // 6. Get current label text color
  const initialTxtColor = currentColorEl.style.getPropertyValue("color");
  const initialTxtColorHex = initialTxtColor.startsWith("rgb(") ? rgbStringToHex(initialTxtColor) : initialTxtColor;

  // 7. Create new text color selector
  const txtInner = txtColorCol.querySelector("div");

  // 7.1 Remove previous color inputs
  txtInner.querySelectorAll("input[type=color]").forEach(n => n.remove());

  // 7.2 Add color input to node
  const txtClrNode = document.createElement("div");
  const txtClrBtn = document.createElement("button");
  const txtColorInput = document.createElement("input");
  const txtColorChangeListener = () => {
    // Text color
    txtCells.selected.node.ariaLabel = txtColorInput.value;
    txtTickNode.style.backgroundColor = txtColorInput.value;
    labelTxtNode.style.color = txtColorInput.value;
    txtClrNode.style.color = txtColorInput.value;
  }
  setupColorInput(txtClrNode, txtClrBtn, txtColorInput, txtColorChangeListener, initialTxtColorHex);


  
  // --------------- Background color ---------------
  // 0. Get background color cells
  const bgCellList = Array.from(bgColorCol.querySelectorAll("td"));

  // 1. Group background color cells by class
  const bgCells = getCellsBySelected(bgCellList);
  
  // 2. Get selected box
  const bgTickNode = bgCells.selected.node.querySelector("div");

  // 3. Delete all other boxes
  bgCells.unselected?.nodes?.forEach(n => n.remove());

  // 4. Center the remaining box
  // TODO: Is this really necessary?
  const bgRows = Array.from(bgColorCol.querySelectorAll("div > div"));
  bgRows.forEach(r => r.style = "display: flex; justify-content: center;");

  // 5. Get node that displays the background color
  const labelNode = modalContent.querySelector("div [title][style]");

  // 6. Get current label background color
  const initialBgColor = currentColorEl.style.getPropertyValue("background-color");
  const initialBgColorHex = initialBgColor.startsWith("rgb(") ? rgbStringToHex(initialBgColor) : initialBgColor;

  // 7. Create new background color selector
  const bgInner = bgColorCol.querySelector("div");
  
  // 7.1 Remove previous color inputs
  bgInner.querySelectorAll("input[type=color]").forEach(n => n.remove());
  
  // 7.2 Add color input to node
  const bgClrNode = document.createElement("div");
  const bgClrBtn = document.createElement("button");
  const bgColorInput = document.createElement("input");
  const bgColorChangeListener = () => {
    // Label color
    bgCells.selected.node.ariaLabel = bgColorInput.value;
    bgTickNode.style.backgroundColor = bgColorInput.value;
    labelNode.style.backgroundColor = bgColorInput.value;
    bgClrNode.style.color = bgColorInput.value;

    // Text color
    if (checkboxInputEl.checked) {
      const txtColor = colorIsDark(bgColorInput.value) ? "#ffffff" : "#000000";
      txtColorInput.value = txtColor;
      txtColorInput.dispatchEvent(new Event("input"));
    }
  }
  setupColorInput(bgClrNode, bgClrBtn, bgColorInput, bgColorChangeListener, initialBgColorHex);






  // --------------- Hide old UI ---------------
  // 0. Hide headers
  // for (let i = 1; i <= 3; i++) {
  //   const header = modalContent.querySelector(tableHeadSelector(i));
  //   header.style.display = "none";
  // }

  // 1. Hide spacer & text color column
  bgColorCol.style.display = "none";
  spacerCol.style.display = "none";
  txtColorCol.style.display = "none";

  // 2. Add new color picker row
  const newRowNode = document.createElement("tr");
  const colNode1 = document.createElement("td");
  const colNode2 = document.createElement("td");
  const colNode3 = document.createElement("td");
  colNode1.style = "padding-top: 12px;";
  newRowNode.appendChild(colNode1);
  newRowNode.appendChild(colNode2);
  newRowNode.appendChild(colNode3);

  colNode1.appendChild(bgClrNode);
  colNode3.appendChild(txtClrNode);
  tbody.appendChild(newRowNode);

  // 3. Add text color checkbox & enable
  const newRowNode2 = document.createElement("tr");
  const checkboxColNode = document.createElement("td");
  checkboxColNode.colSpan = 3;
  checkboxColNode.style = "padding-top: 24px; text-align: center;";
  newRowNode2.appendChild(checkboxColNode);
  
  // checkboxInputEl.checked = true;
  checkboxColNode.appendChild(checkboxLabelEl);
  tbody.appendChild(newRowNode2);


  // 4. Fix up alignment
  // table.style = "display: flex; justify-content: center; padding: 1em;";
  // tbody.style = "display: table; width: 33%;";
  // tbody.style = "display: table;";
}


/* Listen and react to document mutations, i.e. apply modal transformations if appropriate */
function mutationHandler(mutations) {
  mutations.forEach((m) => {
    m.addedNodes.forEach((node) => {
      // Ignore non-elements
      if (node.nodeType !== 1)
        return;

      // Ignore nodes that don't have the attribute or have it set to false
      if (!node.hasAttribute(MODAL_ATTR) || node.getAttribute(MODAL_ATTR) !== "true")
        return;

      // Transform the modal (if config is enabled)
      if (EXTN_ENABLED)
        transformModal(node);
      else
        console.log(LOG_PREFIX, "Extension is disabled, not transforming modal");
    });
  });
}



console.log(LOG_PREFIX, "Content script loaded");
console.log(LOG_PREFIX, "Starting observer");

const observer = new MutationObserver(mutationHandler);
const observerConfig = { childList: true, subtree: true };

observer.observe(document.body, observerConfig);
