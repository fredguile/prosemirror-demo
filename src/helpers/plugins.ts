import { Plugin } from "prosemirror-state";

export const statsPlugin = new Plugin({
  props: {
    handleKeyDown: (view, event) => {
      console.log({
        keydown: event.key,
        doc: view.state.doc.toJSON()
      });
      return false;
    }
  }
});
