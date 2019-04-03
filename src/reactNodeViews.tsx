import React, { useCallback } from "react";
import { render } from "react-dom";
import { Node as PMNode } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

// hmm, this part is currently useless... please don't look at it :)
export interface ReactComponentProps {
  view: EditorView;
  getPos: any;
  node: PMNode;
  contentDOM: Node;
}

export const appendContentDOM = (contentDOM: Node) =>
  useCallback((node: Node | undefined) => {
    if (node) node.appendChild(contentDOM);
  }, []);

export const ParagraphComponent = (props: ReactComponentProps) => (
  <span
    className="paragraph-wrapper"
    style={{ position: "relative" }}
    ref={appendContentDOM(props.contentDOM)}
  />
);

export const LinkComponent = (props: ReactComponentProps) => (
  <span
    className="link-wrapper"
    style={{ position: "relative" }}
    ref={appendContentDOM(props.contentDOM)}
  />
);

export class ReactNodeView {
  private dom: Node | undefined;
  private contentDOM: Node | undefined;

  constructor(
    private view: EditorView,
    private getPos: () => number,
    private node,
    nodeName: string
  ) {
    this.dom = document.createElement(nodeName);
    this.contentDOM = document.createElement("content");

    if (nodeName === "p") {
      render(
        <ParagraphComponent
          view={this.view}
          getPos={this.getPos}
          node={this.node}
          contentDOM={this.contentDOM!}
        />,
        this.dom
      );
    }

    if (nodeName === "a") {
      render(
        <LinkComponent
          view={this.view}
          getPos={this.getPos}
          node={this.node}
          contentDOM={this.contentDOM}
        />,
        this.dom
      );
    }
  }

  ignoreMutation() {
    return true;
  }
}

export default function wrapInReactNodeView(nodeName: string) {
  return (node: PMNode, view: EditorView, getPos: () => number) =>
    new ReactNodeView(view, getPos, node, nodeName);
}
