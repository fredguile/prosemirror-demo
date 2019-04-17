import { EditorView } from "prosemirror-view";

export function setCrosshairChanging(
  crosshairEl: HTMLElement,
  changing: boolean
) {
  if (changing) {
    crosshairEl.classList.add("changing");
    return;
  }
  crosshairEl.classList.remove("changing");
}

export function toggleCrosshairChanging(crosshairEl: HTMLElement) {
  crosshairEl.classList.toggle("changing");
}

export function pinCrosshairOnSelection(
  editor: EditorView,
  crosshairEl: HTMLElement
) {
  const {
    state: { selection }
  } = editor;

  const cursorPos = (selection.$cursor && selection.$cursor.pos) || undefined;
  if (typeof cursorPos === "undefined") {
    return;
  }

  const { x, left, top, bottom } = editor.coordsAtPos(cursorPos);
  crosshairEl.style.left = `${x || left}px`;
  crosshairEl.style.top = `${top + (bottom - top) / 2}px`;
}
