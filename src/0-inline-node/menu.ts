import { NodeType, Schema } from "prosemirror-model";
import { Menu, MenuItem } from "prosemirror-menu";
import { buildMenuItems } from "prosemirror-example-setup";

export function createInsertInlineNodeCmd(
  inlineNodeType: NodeType,
  nodeType: string
) {
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

export default function buildMenu(
  schema: Schema,
  spanNodeValues: string[],
  divNodeValues: string[]
): Menu {
  const {
    nodes: {
      spanInlineNode: spanInlineNodeType,
      divInlineNode: divInlineNodeType
    }
  } = schema;

  const menu = buildMenuItems(schema);

  [
    ["SPAN", spanInlineNodeType, spanNodeValues],
    ["DIV", divInlineNodeType, divNodeValues]
  ].forEach(([tag, inlineNodeType, nodeValues]) =>
    nodeValues.forEach(nodeValue =>
      menu.insertMenu.content.push(
        new MenuItem({
          title: `Insert ${nodeValue} (${tag})`,
          label: `${nodeValue.charAt(0).toUpperCase()}${nodeValue.slice(
            1
          )} (${tag})`,
          enable: state =>
            createInsertInlineNodeCmd(inlineNodeType, nodeValue)(state),
          run: createInsertInlineNodeCmd(inlineNodeType, nodeValue)
        })
      )
    )
  );

  return menu;
}
