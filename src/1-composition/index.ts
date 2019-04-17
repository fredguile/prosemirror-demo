import { EditorView } from "prosemirror-view";
import { Transaction } from "prosemirror-transform";
import { schema as initialSchema } from "prosemirror-schema-basic";
import { buildMenuItems } from "prosemirror-example-setup";

import {
  pinCrosshairOnSelection,
  setCrosshairChanging,
  toggleCrosshairChanging
} from "./crosshair";

import {
  compose,
  tap,
  createEditor,
  createSchemaWithList,
  defaultDispatchTransaction,
  statsPlugin,
  observeDOMNode,
  trackAddedRemoved
} from "../helpers";

const editorEl = document.querySelector("#editor");
const contentEl = document.querySelector("#content");
const crosshairEl = document.querySelector("#crosshair") as HTMLDivElement;

const mySchema = compose(createSchemaWithList)(initialSchema);
const menu = buildMenuItems(mySchema);

const editor = createEditor(
  editorEl,
  contentEl,
  mySchema,
  menu,
  [statsPlugin],
  compose(
    defaultDispatchTransaction,
    tap(tr => {
      if (tr.selectionSet) {
        setCrosshairChanging(crosshairEl, true);
      }
    })
  )
);

pinCrosshairOnSelection(editor, crosshairEl);

observeDOMNode(
  editorEl,
  compose(
    ({ added, removed }) => {
      if (added > 0 || removed > 0) {
        setCrosshairChanging(crosshairEl, false);
        pinCrosshairOnSelection(editor, crosshairEl);
      }
    },
    trackAddedRemoved
  ),
  {
    attributes: true,
    childList: true,
    subtree: true
  }
);

console.log("Simpled Editor initialized!");
