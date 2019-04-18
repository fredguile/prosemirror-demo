import { EditorView } from "prosemirror-view";
import { schema as initialSchema } from "prosemirror-schema-basic";

import buildMenu from "./menu";

import {
  createEditor,
  createSchemaWithCustomInlineNodes,
  createSchemaWithCustomParagraphs,
  createSchemaWithList,
  compose,
  observeDOMNode,
  onKeyDownEvent,
  trackAddedRemoved
} from "../helpers";

const editorEl = document.querySelector("#editor");
const contentEl = document.querySelector("#content");

const spanNodeValues = ["brontosaurus", "stegosaurus", "triceratops"];
const divNodeValues = ["tyrannosaurus", "pterodactyl"];

const mySchema = compose(
  createSchemaWithList,
  createSchemaWithCustomParagraphs,
  createSchemaWithCustomInlineNodes("span", spanNodeValues, "inline-node1"),
  createSchemaWithCustomInlineNodes("div", divNodeValues, "inline-node2")
)(initialSchema);

const menu = buildMenu(mySchema, spanNodeValues, divNodeValues);

createEditor(editorEl, contentEl, mySchema, menu, [
  onKeyDownEvent("*", (view: EditorView, event: KeyboardEvent) =>
    console.log({
      keydown: event.key,
      doc: view.state.doc.toJSON()
    })
  )
]);

observeDOMNode(
  editorEl,
  compose(
    console.log,
    trackAddedRemoved
  ),
  {
    attributes: true,
    childList: true,
    subtree: true
  }
);

console.log("Simpled Editor initialized!");
