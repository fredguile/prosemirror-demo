import { NodeSpec, NodeType, Schema } from "prosemirror-model";
import { Menu, MenuItem } from "prosemirror-menu";
import { buildMenuItems } from "prosemirror-example-setup";

const spanInlineNodes = ["brontosaurus", "stegosaurus", "triceratops"];
const divInlineNodes = ["tyrannosaurus", "pterodactyl"];

const spanInlineNodeSpec: NodeSpec = {
  attrs: { type: { default: "brontosaurus" } },
  inline: true,
  group: "inline",
  draggable: true,

  toDOM: node => [
    "span",
    {
      "data-span-inline-node": node.attrs.type,
      title: node.attrs.type,
      class: "inline-node1"
    },
    `:${node.attrs.type}`
  ],

  parseDOM: [
    {
      tag: "span[data-span-inline-node]",
      getAttrs: dom =>
        spanInlineNodes.indexOf(dom.dataset.spanInlineNode) > -1
          ? { type: dom.dataset.spanInlineNode }
          : false
    }
  ]
};

const divInlineNodeSpec: NodeSpec = {
  attrs: { type: { default: "tyrannosaurus" } },
  inline: true,
  group: "inline",
  draggable: true,

  toDOM: node => [
    "div",
    {
      "data-div-inline-node": node.attrs.type,
      class: "inline-node2"
    },
    ["div", `:${node.attrs.type}`]
  ],

  parseDOM: [
    {
      tag: "div[data-div-inline-node]",
      getAttrs: dom =>
        divInlineNodes.indexOf(dom.dataset.divInlineNode) > -1
          ? { type: dom.dataset.divInlineNode }
          : false
    }
  ]
};

export function createSchemaWithInlineNodes(initialSchema: Schema) {
  return new Schema({
    nodes: initialSchema.spec.nodes
      .addBefore("span", "spanInlineNode", spanInlineNodeSpec)
      .addBefore("div", "divInlineNode", divInlineNodeSpec),
    marks: initialSchema.spec.marks
  });
}

function createInsertInlineNodeCmd(inlineNodeType: NodeType, nodeType: string) {
  return (state, dispatch?) => {
    const { $from } = state.selection;
    const index = $from.index();

    if (!$from.parent.canReplaceWith(index, index, inlineNodeType))
      return false;

    if (dispatch)
      dispatch(
        state.tr.replaceSelectionWith(inlineNodeType.create({ type: nodeType }))
      );

    return true;
  };
}

export function createInlineNodeMenu(schema: Schema): Menu {
  const {
    nodes: {
      spanInlineNode: spanInlineNodeType,
      divInlineNode: divInlineNodeType
    }
  } = schema;

  const menu = buildMenuItems(schema);

  spanInlineNodes.forEach(spanInlineNode =>
    menu.insertMenu.content.push(
      new MenuItem({
        title: `Insert ${spanInlineNode} (SPAN)`,
        label: `${spanInlineNode.charAt(0).toUpperCase()}${spanInlineNode.slice(
          1
        )} (SPAN)`,
        enable: state =>
          createInsertInlineNodeCmd(spanInlineNodeType, spanInlineNode)(state),
        run: createInsertInlineNodeCmd(spanInlineNodeType, spanInlineNode)
      })
    )
  );

  divInlineNodes.forEach(divInlineNode =>
    menu.insertMenu.content.push(
      new MenuItem({
        title: `Insert ${divInlineNode} (DIV)`,
        label: `${divInlineNode.charAt(0).toUpperCase()}${divInlineNode.slice(
          1
        )} (DIV)`,
        enable: state =>
          createInsertInlineNodeCmd(divInlineNodeType, divInlineNode)(state),
        run: createInsertInlineNodeCmd(divInlineNodeType, divInlineNode)
      })
    )
  );

  return menu;
}
