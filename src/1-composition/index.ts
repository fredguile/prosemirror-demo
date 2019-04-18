import { EditorView } from "prosemirror-view";
import { Transaction } from "prosemirror-state";
import { schema as initialSchema } from "prosemirror-schema-basic";
import { buildMenuItems } from "prosemirror-example-setup";

import { pinCrosshairOnSelection, setCrosshairChanging } from "./crosshair";

import {
  compose,
  createEditor,
  createSchemaWithList,
  onInputEvent,
  observeDOMNode,
  trackAddedRemoved
} from "../helpers";

const editorEl = document.querySelector("#editor");
const contentEl = document.querySelector("#content");
const crosshairEl = document.querySelector("#crosshair") as HTMLDivElement;

const mySchema = compose(createSchemaWithList)(initialSchema);
const menu = buildMenuItems(mySchema);

function updateCrosshairLocation(crosshairEl: HTMLElement) {
  return (view: EditorView) => pinCrosshairOnSelection(view, crosshairEl);
}

const editor = createEditor(
  editorEl,
  contentEl,
  mySchema,
  menu,
  [
    onInputEvent("insertText", updateCrosshairLocation(crosshairEl)),
    onInputEvent("insertCompositionText", updateCrosshairLocation(crosshairEl))
  ],
  (tr: Transaction) => {
    return (view: EditorView) => {
      view.updateState(view.state.apply(tr));
      setCrosshairChanging(crosshairEl, true);

      if (tr.selectionSet || tr.docChanged) {
        pinCrosshairOnSelection(editor, crosshairEl);
      }
    };
  }
);

pinCrosshairOnSelection(editor, crosshairEl);

observeDOMNode(
  editorEl,
  compose(
    ({ added, removed }) => {
      if (added > 0 || removed > 0) {
        setCrosshairChanging(crosshairEl, false);
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
