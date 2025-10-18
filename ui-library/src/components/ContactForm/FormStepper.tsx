'use client';

import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { useCallback, useId } from "react";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  isComplete?: boolean;
}

export interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
  onNavigate: (nextIndex: number) => void;
}

export function FormStepper({ steps, currentStep, onNavigate }: FormStepperProps): JSX.Element {
  const baseId = useId();
  const tabOrientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    md: "horizontal"
  });

  const handleKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (index + 1) % steps.length;
        onNavigate(nextIndex);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = (index - 1 + steps.length) % steps.length;
        onNavigate(prevIndex);
      }
    },
    [onNavigate, steps.length]
  );

  const selectedBg = useColorModeValue("brand.50", "rgba(56, 189, 248, 0.16)");
  const selectedColor = useColorModeValue("brand.900", "brand.100");

  return (
    <HStack
      as="div"
      justify="space-between"
      align={{ base: "stretch", md: "center" }}
      spacing={4}
      direction={tabOrientation === "vertical" ? "column" : "row"}
      role="tablist"
      aria-label="Contact form progress"
      data-orientation={tabOrientation}
    >
      {steps.map((step, index) => {
        const isSelected = index === currentStep;
        const tabId = `${baseId}-tab-${step.id}`;
        const panelId = `${baseId}-panel-${step.id}`;
        return (
          <Button
            key={step.id}
            id={tabId}
            aria-controls={panelId}
            role="tab"
            aria-selected={isSelected}
            variant={isSelected ? "solid" : "ghost"}
            colorScheme={isSelected ? "teal" : "gray"}
            onClick={() => onNavigate(index)}
            onKeyDown={handleKeyDown(index)}
            tabIndex={isSelected ? 0 : -1}
            borderRadius="full"
            px={3}
            py={3}
            minW={{ base: "auto", md: "160px" }}
            justifyContent="flex-start"
            bg={isSelected ? selectedBg : undefined}
            color={isSelected ? selectedColor : undefined}
            _hover={{ bg: isSelected ? selectedBg : "bg.surfaceHover" }}
            _focusVisible={{ boxShadow: "outline" }}
            aria-label={`${index + 1}. ${step.title}`}
          >
            <Stack direction="row" align="center" spacing={3}>
              <Box
                as="span"
                aria-hidden
                borderWidth="1px"
                borderColor={step.isComplete ? "teal.500" : "transparent"}
                bg={step.isComplete ? "teal.500" : "transparent"}
                color={step.isComplete ? "white" : "transparent"}
                borderRadius="full"
                width="18px"
                height="18px"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
              >
                ✓
              </Box>
              <Stack spacing={0} align="flex-start">
                <Text fontSize="sm" fontWeight="medium">
                  {index + 1}. {step.title}
                </Text>
                {step.description ? (
                  <Text fontSize="xs" color="text.muted">
                    {step.description}
                  </Text>
                ) : null}
              </Stack>
            </Stack>
          </Button>
        );
      })}
    </HStack>
  );
}
