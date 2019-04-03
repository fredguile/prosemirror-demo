import { DOMParser, Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";

import createSchemaWithCustomParagraph from "./customParagraph";

import {
  createSchemaWithInlineNodes,
  createInlineNodeMenu
} from "./inlineNodeViews";

import { compose } from "./utils";

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

export function createSchemaWithList(initialSchema: Schema) {
  return new Schema({
    nodes: addListNodes(initialSchema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
  });
}

export default function createEditor(editorEl: Element, contentEl: Element) {
  const mySchema = compose(
    createSchemaWithInlineNodes,
    createSchemaWithList,
    createSchemaWithCustomParagraph
  )(schema);

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
