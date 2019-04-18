import { EditorView } from "prosemirror-view";
import { Plugin } from "prosemirror-state";

export const onInputEvent = (
  inputType: string,
  cb: (view: EditorView) => void
) =>
  new Plugin({
    props: {
      handleDOMEvents: {
        input: (view, event) => {
          if (event.inputType === inputType) {
            cb(view);
          }
          return false;
        }
      }
    }
  });

export const onKeyDownEvent = (
  keyCode: string | number,
  cb: (view: EditorView, event: KeyboardEvent) => void
) =>
  new Plugin({
    props: {
      handleKeyDown: (view, event) => {
        if (keyCode === "*" || event.keyCode === keyCode) {
          cb(view, event);
        }
        return false;
      }
    }
  });
