/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createEditor,
  type Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Text,
  type BaseEditor,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";

// --- Tipi custom per Slate ---
export interface CustomText extends Text {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface CustomElement extends SlateElement {
  type: string;
  align?: "left" | "center" | "right";
  children: Descendant[]; // sempre Descendant[]
}

export type CustomNode = CustomElement | CustomText;
export type CustomEditor = BaseEditor & ReactEditor;
type MarkFormat = "bold" | "italic" | "underline";
type BlockFormat =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "numbered-list"
  | "bulleted-list"
  | "list-item";
type AlignFormat = "left" | "center" | "right";

// --- Helper Marks & Blocks ---
const isMarkActive = (editor: CustomEditor, format: MarkFormat) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Text.isText(n) && (n as CustomText)[format] === true,
    universal: true,
  });

  return !!match;
};

const toggleMark = (editor: CustomEditor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: CustomEditor, format: BlockFormat) => {
  const [match] = Editor.nodes(editor, {
    match: (n): n is CustomElement =>
      SlateElement.isElement(n) &&
      Editor.isBlock(editor, n) &&
      (n as CustomElement).type === format,
  });

  return !!match;
};

const toggleBlock = (editor: CustomEditor, format: BlockFormat) => {
  const isActive = isBlockActive(editor, format);

  Transforms.setNodes<CustomElement>(
    editor,
    { type: isActive ? "paragraph" : format },
    {
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    },
  );
};

const isAlignActive = (editor: CustomEditor, align: AlignFormat) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      Editor.isBlock(editor, n) &&
      (n as CustomElement).align === align,
  });

  return !!match;
};

const toggleAlign = (editor: CustomEditor, align: AlignFormat) => {
  const isActive = isAlignActive(editor, align);

  Transforms.setNodes<CustomElement>(
    editor,
    {
      align: isActive ? "left" : align,
    },
    {
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    },
  );
};

const renderLeaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

// --- Toolbar Buttons ---
const MarkButton = ({
  editor,
  format,
  label,
}: {
  editor: CustomEditor;
  format: MarkFormat;
  label: React.ReactNode;
}) => {
  const active = isMarkActive(editor, format);

  return (
    <Button
      size="small"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      sx={{
        minWidth: 0,
        padding: 0,
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 1,
        color: active ? "primary.main" : "text.primary",
        bgcolor: active ? "action.selected" : "transparent",
        "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
      }}
    >
      {label}
    </Button>
  );
};

const BlockButton = ({
  editor,
  format,
  label,
}: {
  editor: CustomEditor;
  format: BlockFormat;
  label: React.ReactNode;
}) => {
  const active = isBlockActive(editor, format);
  return (
    <Button
      size="small"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      sx={{
        minWidth: 0,
        padding: 0,
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 1,
        color: active ? "primary.main" : "text.primary",
        bgcolor: active ? "action.selected" : "transparent",
        "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
      }}
    >
      {label}
    </Button>
  );
};

const AlignButton = ({
  editor,
  align,
  label,
}: {
  editor: CustomEditor;
  align: AlignFormat;
  label: React.ReactNode;
}) => {
  const active = isAlignActive(editor, align);
  return (
    <Button
      size="small"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleAlign(editor, align);
      }}
      sx={{
        minWidth: 0,
        padding: 0,
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 1,
        color: active ? "primary.main" : "text.primary",
        bgcolor: active ? "action.selected" : "transparent",
        "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
      }}
    >
      {label}
    </Button>
  );
};

type Props = {
  value: Descendant[];
  setValue: (value: Descendant[]) => void;
};

export default function SlateEditor({ setValue, value }: Props) {
  const editor = useMemo(
    () => withHistory(withReact(createEditor() as CustomEditor)),
    [],
  );
  return (
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <Box mb={1} display="flex">
        {/* Marks */}
        <MarkButton
          editor={editor}
          format="bold"
          label={<FormatBoldIcon />}
        ></MarkButton>
        <MarkButton
          editor={editor}
          format="italic"
          label={<FormatItalicIcon />}
        />
        <MarkButton
          editor={editor}
          format="underline"
          label={<FormatUnderlinedIcon />}
        />

        {/* Blocks */}
        <BlockButton
          editor={editor}
          format="heading-one"
          label={<LooksOneIcon />}
        />
        <BlockButton
          editor={editor}
          format="heading-two"
          label={<LooksTwoIcon />}
        />
        <BlockButton
          editor={editor}
          format="heading-three"
          label={<Looks3Icon />}
        />
        <BlockButton editor={editor} format="paragraph" label="P" />
        <BlockButton
          editor={editor}
          format="numbered-list"
          label={<FormatListNumberedIcon />}
        />
        <BlockButton
          editor={editor}
          format="bulleted-list"
          label={<FormatListBulletedIcon />}
        />

        {/* Alignment */}
        <AlignButton
          editor={editor}
          align="left"
          label={<FormatAlignLeftIcon />}
        />
        <AlignButton
          editor={editor}
          align="center"
          label={<FormatAlignCenterIcon />}
        />
        <AlignButton
          editor={editor}
          align="right"
          label={<FormatAlignRightIcon />}
        />
      </Box>

      <Editable
        style={{ padding: 3 }}
        placeholder="Write your content..."
        renderElement={(props: RenderElementProps) => {
          const { attributes, children, element } = props;
          const el = element as CustomElement;

          switch (el.type) {
            case "heading-one":
              return (
                <h1 {...attributes} style={{ textAlign: el.align || "left" }}>
                  {children}
                </h1>
              );
            case "heading-two":
              return (
                <h2 {...attributes} style={{ textAlign: el.align || "left" }}>
                  {children}
                </h2>
              );
            case "heading-three":
              return (
                <h3 {...attributes} style={{ textAlign: el.align || "left" }}>
                  {children}
                </h3>
              );
            case "bulleted-list":
              return (
                <ul {...attributes} style={{ textAlign: el.align || "left" }}>
                  <li>{children}</li>
                </ul>
              );

            case "numbered-list":
              return (
                <ol {...attributes} style={{ textAlign: el.align || "left" }}>
                  <li>{children}</li>
                </ol>
              );
            case "paragraph":
            default:
              return (
                <p {...attributes} style={{ textAlign: el.align || "left" }}>
                  {children}
                </p>
              );
          }
        }}
        renderLeaf={(props: RenderLeafProps) => renderLeaf(props)}
      />
    </Slate>
  );
}
