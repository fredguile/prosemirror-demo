import { NodeSpec, Schema } from "prosemirror-model";

// it's like the default ProseMirror paragraph, but we'd like to render it using a <div> instead of <p>
// see: https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js

export const customParagraphSpec: NodeSpec = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "div[class=paragraph]" }],
  toDOM: () => ["div", { class: "paragraph" }, 0]
};

export default function createSchemaWithCustomParagraph(initialSchema: Schema) {
  return new Schema({
    nodes: initialSchema.spec.nodes.addToEnd(
      "custom-paragraph",
      customParagraphSpec
    ),
    marks: initialSchema.spec.marks
  });
}
