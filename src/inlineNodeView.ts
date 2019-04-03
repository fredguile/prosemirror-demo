import { NodeSpec, Schema } from "prosemirror-model";
import { Menu, MenuItem } from "prosemirror-menu";
import { buildMenuItems } from "prosemirror-example-setup";

// The supported types of dinosaurs.
export const dinos = [
  "brontosaurus",
  "stegosaurus",
  "triceratops",
  "tyrannosaurus",
  "pterodactyl"
];

export const dinoNodeSpec: NodeSpec = {
  // Dinosaurs have one attribute, their type, which must be one of
  // the types defined above.
  // Brontosaurs are still the default dino.
  attrs: { type: { default: "brontosaurus" } },
  inline: true,
  group: "inline",
  draggable: true,

  // These nodes are rendered as images with a `dino-type` attribute.
  toDOM: node => [
    "div",
    {
      "data-dino-type": node.attrs.type,
      class: "dinosaur"
    },
    ["div", `:${node.attrs.type}`]
  ],
  // When parsing, such an image, if its type matches one of the known
  // types, is converted to a dino node.
  parseDOM: [
    {
      tag: "div[data-dino-type]",
      getAttrs: dom =>
        dinos.indexOf(dom.dataset.dinoType) > -1
          ? { type: dom.dataset.dinoType }
          : false
    }
  ]
};

export function createSchemaWithInlineNodes(initialSchema: Schema) {
  return new Schema({
    nodes: initialSchema.spec.nodes.addBefore("span", "dino", dinoNodeSpec),
    marks: initialSchema.spec.marks
  });
}

export function createInlineNodeMenu(schema: Schema): Menu {
  const menu = buildMenuItems(schema);

  dinos.forEach(dino =>
    menu.insertMenu.content.push(
      new MenuItem({
        title: `Insert ${dino}`,
        label: `${dino.charAt(0).toUpperCase()}${dino.slice(1)}`,
        enable: state => createInsertInlineNodeCmd(schema, dino)(state),
        run: createInsertInlineNodeCmd(schema, dino)
      })
    )
  );

  return menu;
}

export function createInsertInlineNodeCmd(schema: Schema, type: string) {
  const {
    nodes: { dino: dinoType }
  } = schema;

  return (state, dispatch?) => {
    const { $from } = state.selection;
    const index = $from.index();

    if (!$from.parent.canReplaceWith(index, index, dinoType)) return false;

    if (dispatch)
      dispatch(state.tr.replaceSelectionWith(dinoType.create({ type })));

    return true;
  };
}
