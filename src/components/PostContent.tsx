import React from "react";
import { Typography, Box } from "@mui/material";
import type { CustomNode, CustomElement, CustomText } from "./SlateEditor";
import {  Text, Element as SlateElement, type Descendant } from "slate";

const normalizeDescendants = (nodes: Descendant[]): CustomNode[] => {
  return nodes.map((node) => {
    if (Text.isText(node)) {
      return node as CustomText;
    }

    if (SlateElement.isElement(node)) {
      const el = node as SlateElement & { type?: string; align?: string };

      return {
        ...el,
        type: el.type ?? "paragraph",
        children: normalizeDescendants(el.children),
      } as CustomElement;
    }

    return { text: "" } as CustomText;
  });
};

type Props = {
  content: string;
};

export const PostContent = ({ content }: Props) => {
  let nodes: CustomNode[] = [];

  try {
    const parsed: Descendant[] = JSON.parse(content);
    nodes = normalizeDescendants(parsed);
  } catch {
    nodes = [{ text: content }];
  }

  const renderNode = (node: CustomNode, index: number): React.ReactNode => {
    // 🔹 TEXT NODE
    if ("text" in node) {
      let text: React.ReactNode = node.text;

      if (node.bold) text = <strong>{text}</strong>;
      if (node.italic) text = <em>{text}</em>;
      if (node.underline) text = <u>{text}</u>;

      return <span key={index}>{text}</span>;
    }

    // 🔹 ELEMENT NODE
    const el = node as CustomElement;
    const children = el.children.map((child, i) =>
      renderNode(child as CustomNode, i),
    );

    const align = el.align ?? "left";

    switch (el.type) {
      case "heading-one":
        return (
          <Typography
            key={index}
            variant="h4"
            fontWeight={700}
            sx={{ mt: 2, mb: 1, textAlign: align }}
          >
            {children}
          </Typography>
        );

      case "heading-two":
        return (
          <Typography
            key={index}
            variant="h5"
            fontWeight={600}
            sx={{ mt: 2, mb: 1, textAlign: align }}
          >
            {children}
          </Typography>
        );

      case "heading-three":
        return (
          <Typography
            key={index}
            variant="h6"
            fontWeight={600}
            sx={{ mt: 2, mb: 1, textAlign: align }}
          >
            {children}
          </Typography>
        );

      case "numbered-list":
        return (
          <Box
            key={index}
            component="ol"
            sx={{ pl: 4, my: 1, textAlign: align }}
          >
            {children.map((child, i) => (
              <li key={i}>{child}</li>
            ))}
          </Box>
        );

      case "bulleted-list":
        return (
          <Box
            key={index}
            component="ul"
            sx={{ pl: 4, my: 1, textAlign: align }}
          >
            {children.map((child, i) => (
              <li key={i}>{child}</li>
            ))}
          </Box>
        );

      case "paragraph":
      default:
        return (
          <Typography
            key={index}
            variant="body1"
            sx={{ mt: 1, mb: 1, textAlign: align }}
          >
            {children}
          </Typography>
        );
    }
  };

  return <Box>{nodes.map(renderNode)}</Box>;
};
