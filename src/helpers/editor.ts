import { DOMParser, Schema } from "prosemirror-model";
import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Menu } from "prosemirror-menu";
import { exampleSetup } from "prosemirror-example-setup";

export function defaultDispatchTransaction(
  tr: Transaction
): (view: EditorView) => void {
  return (view: EditorView) => view.updateState(view.state.apply(tr));
}

export function createEditor(
  editorEl: Element,
  contentEl: Element,
  schema: Schema,
  menu: Menu,
  plugins: Plugin[] = [],
  dispatchTransaction = defaultDispatchTransaction
): EditorView {
  const view = new EditorView(editorEl, {
    state: EditorState.create({
      schema,
      doc: DOMParser.fromSchema(schema).parse(contentEl),
      plugins: plugins.concat(
        exampleSetup({ schema, menuContent: menu.fullMenu })
      )
    }),
    dispatchTransaction: (tr: Transaction) => dispatchTransaction(tr)(view)
  });

  return view;
}
