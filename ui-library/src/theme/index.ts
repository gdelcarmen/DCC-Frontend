import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
  cssVarPrefix: "dcc"
};

const colors = {
  brand: {
    navy: "#0F1B2B",
    slate: "#1C2A3A",
    sky: "#5BA4D0"
  },
  accent: {
    gold: "#D4A017",
    teal: "#1B8A94"
  },
  neutral: {
    50: "#F8FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A"
  },
  success: {
    500: "#2F855A"
  },
  warning: {
    500: "#DD6B20"
  },
  danger: {
    500: "#C53030"
  }
};

const fonts = {
  heading: `'Work Sans', 'Segoe UI', sans-serif`,
  body: `'Source Sans 3', 'Segoe UI', sans-serif`,
  mono: `'Fira Mono', 'SFMono-Regular', monospace`
};

const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
};

export const reducedMotionTransition = {
  baseDuration: 0.35,
  disabledDuration: 0,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)"
};

export const getMotionProps = (prefersReducedMotion: boolean) =>
  prefersReducedMotion
    ? { transition: { duration: reducedMotionTransition.disabledDuration } }
    : {
        transition: {
          duration: reducedMotionTransition.baseDuration,
          ease: reducedMotionTransition.easing
        }
      };

export const theme = extendTheme({
  config,
  fonts,
  fontWeights,
  colors,
  semanticTokens: {
    colors: {
      "bg.surface": {
        default: "neutral.50",
        _dark: "neutral.900"
      },
      "bg.canvas": {
        default: "neutral.100",
        _dark: "neutral.800"
      },
      "text.default": {
        default: "neutral.900",
        _dark: "neutral.100"
      },
      "text.muted": {
        default: "neutral.600",
        _dark: "neutral.300"
      },
      "border.subtle": {
        default: "neutral.200",
        _dark: "neutral.700"
      },
      "accent.gold": {
        default: "accent.gold"
      },
      "accent.teal": {
        default: "accent.teal"
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold"
      },
      defaultProps: {
        colorScheme: "brand"
      },
      variants: {
        solid: {
          rounded: "lg"
        }
      }
    },
    Heading: {
      baseStyle: {
        color: "text.default"
      }
    },
    Text: {
      baseStyle: {
        color: "text.default"
      }
    }
  },
  styles: {
    global: (props: { colorMode?: "light" | "dark" }) => ({
      body: {
        bg: props.colorMode === "dark" ? "neutral.900" : "neutral.50",
        color: props.colorMode === "dark" ? "neutral.50" : "neutral.900",
        fontFamily: fonts.body,
        lineHeight: 1.6
      },
      "*, *::before, *::after": {
        borderColor: "border.subtle",
        wordBreak: "break-word"
      },
      "::selection": {
        backgroundColor: "accent.gold",
        color: "neutral.900"
      },
      "@media (prefers-reduced-motion: reduce)": {
        "*": {
          animationDuration: "0.001ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.001ms !important",
          scrollBehavior: "auto !important"
        }
      }
    })
  }
});

export default theme;
