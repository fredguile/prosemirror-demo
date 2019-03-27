import { DOMParser, Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";

import {
  createSchemaWithInlineNodes,
  createInsertInlineNodeCmd,
  createInlineNodeMenu,
  dinos
} from "./inlineNodeView";

const statsPlugin = new Plugin({
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

export default function createEditor(editorEl: Element, contentEl: Element) {
  const schemaWithList = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
  });
  const mySchema = createSchemaWithInlineNodes(schemaWithList);
  const menu = createInlineNodeMenu(mySchema);
  const initialDoc = DOMParser.fromSchema(mySchema).parse(contentEl);

  const state = EditorState.create({
    schema: mySchema,
    doc: initialDoc,
    plugins: [statsPlugin].concat(
      exampleSetup({ schema: mySchema, menuContent: menu.fullMenu })
    )
  });

  const view = new EditorView(editorEl, {
    state,
    // nodeViews: {
    //   paragraph: wrapInReactNodeView("p"),
    //   link: wrapInReactNodeView("a")
    // },
    dispatchTransaction: transaction => {
      const nextState = view.state.apply(transaction);
      view.updateState(nextState);
    }
  });

  return view;
}
