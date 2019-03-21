import createEditor from "./src/createEditor";
import domObserver from "./src/domObserver";

const editorEl = document.querySelector("#editor");
createEditor(editorEl, document.querySelector("#content"));

domObserver.observe(editorEl, {
  attributes: true,
  childList: true,
  subtree: true
});

console.log("Simpled Editor initialized!");
