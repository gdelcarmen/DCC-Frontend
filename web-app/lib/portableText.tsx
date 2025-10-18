'use client';

import { ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { Fragment } from "react";

import type { PortableText } from "@dcc/ui-library";

type PortableBlock = {
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
  listItem?: "bullet" | "number";
};

const extractText = (block: PortableBlock): string =>
  block.children?.map((child) => child.text ?? "").join("") ?? "";

export function PortableTextRenderer({ value }: { value: PortableText }): JSX.Element | null {
  if (!value?.length) {
    return null;
  }

  const elements = value.map((block, index) => {
    const typedBlock = block as PortableBlock;
    const text = extractText(typedBlock);
    if (!text) {
      return null;
    }

    if (typedBlock.listItem === "bullet") {
      return (
        <UnorderedList key={`list-${index}`} spacing={2} pl={6}>
          <ListItem>{text}</ListItem>
        </UnorderedList>
      );
    }

    if (typedBlock.style === "h2" || typedBlock.style === "h3") {
      return (
        <Text key={`heading-${index}`} as={typedBlock.style} fontWeight="bold" fontSize="xl" mt={4}>
          {text}
        </Text>
      );
    }

    return (
      <Text key={`paragraph-${index}`} fontSize="md" color="text.body">
        {text}
      </Text>
    );
  });

  return <Fragment>{elements}</Fragment>;
}
