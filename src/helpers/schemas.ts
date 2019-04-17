import { NodeSpec, Schema } from "prosemirror-model";
import { addListNodes } from "prosemirror-schema-list";

export type InlineNodeTag = "span" | "div";

const createInlineNodeSpec: (
  tag: InlineNodeTag,
  nodeValues: string[],
  cssClass: string
) => NodeSpec = (
  tag: InlineNodeTag,
  nodeValues: string[],
  cssClass: string
): NodeSpec => ({
  attrs: { type: { default: nodeValues[0] } },
  inline: true,
  group: "inline",
  draggable: true,

  toDOM: node => [
    tag,
    {
      [`data-${tag}-inline-node`]: node.attrs.type,
      title: node.attrs.type,
      class: cssClass
    },
    `:${node.attrs.type}`
  ],

  parseDOM: [
    {
      tag: `${tag}[data-${tag}-inline-node]`,
      getAttrs: dom =>
        nodeValues.indexOf(dom.dataset[`${tag}InlineNode`]) > -1
          ? { type: dom.dataset[`${tag}InlineNode`] }
          : false
    }
  ]
});

const customParagraphSpec: NodeSpec = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "div[class=paragraph]" }],
  toDOM: () => ["div", { class: "paragraph" }, 0]
};

export function createSchemaWithList(schema: Schema) {
  return new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
  });
}

export function createSchemaWithCustomInlineNodes(
  tag: InlineNodeTag,
  nodeValues: string[],
  cssClass: string
) {
  return (schema: Schema) =>
    new Schema({
      nodes: schema.spec.nodes.addBefore(
        tag,
        `${tag}InlineNode`,
        createInlineNodeSpec(tag, nodeValues, cssClass)
      ),
      marks: schema.spec.marks
    });
}

export function createSchemaWithCustomParagraphs(schema: Schema) {
  return new Schema({
    nodes: schema.spec.nodes.addToEnd("custom-paragraph", customParagraphSpec),
    marks: schema.spec.marks
  });
}
