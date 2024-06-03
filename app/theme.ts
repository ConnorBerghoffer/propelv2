import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#FF6B35',
  bgCard: '#2A2A2A',
  primaryLight: '#FFD166',
  accent: '#FF3F00',
  bgDark: '#121212',
  bgLight: '#383838',
  text: '#E8E8E8',
  confirm: '#3FA796',
  warning: '#F77F00',
  shadow: 'rgba(0, 0, 0, 0.5)',
  red: '#FF6347',
  orange: '#FFA07A',
  yellow: '#FFD700',
  green: '#90EE90',
  blue: '#ADD8E6',
  indigo: '#6A5ACD',
  violet: '#EE82EE',
};

const activeLabelStyles = { transform: "scale(0.85) translateY(-24px)" };

const components = {
  Menu: {
    parts: ['list', 'item'],
    baseStyle: {
      list: {
        bg: colors.bgCard,  // Ensuring the dropdown background is dark
      },
      item: {
        bg: colors.bgCard,  // Applying the dark background to each dropdown item
        color: colors.text, // Ensuring text is light for visibility
        _hover: {
          bg: colors.bgLight, // Lighter background on hover for contrast
        },
        _focus: {
          bg: colors.bgLight, // Consistent with hover for accessibility
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: colors.bgCard,
      },
    },
  },
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      color: colors.text,
    },
    variants: {
      solid: {
        bg: colors.primary,
        _hover: {
          bg: colors.primaryLight,
        },
      },
      ghost: {
        _hover: {
          bg: colors.bgLight,
        },
      },
    },
  },
  Input: {
    parts: ['field', 'addon'],
    baseStyle: {
      field: {
        color: colors.text,
        _placeholder: {
          color: 'gray.400',
        },
      },
      addon: {
        bg: colors.bgLight,
        color: colors.text,
      },
    },
    variants: {
      filled: {
        field: {
          bg: colors.bgLight,
          color: colors.text,
          _hover: {
            bg: colors.bgLight,
          },
          _focus: {
            bg: colors.bgLight,
          },
        },
        addon: {
          bg: colors.bgLight,
          color: colors.text,
        },
      },
    },
  },
  Textarea: {
    baseStyle: {
      color: colors.text,
    },
    variants: {
      filled: {
        bg: colors.bgLight,
        _hover: {
          bg: colors.bgLight,
        },
        _focus: {
          bg: colors.bgLight,
        },
      },
    },
  },
  Select: {
    baseStyle: {
      color: colors.text,
    },
    variants: {
      filled: {
        field: {
          bg: colors.bgLight,
          _hover: {
            bg: colors.bgLight,
          },
          _focus: {
            bg: colors.bgLight,
          },
        },
      },
    },
  },
  FormLabel: {
    baseStyle: {
      color: colors.text,
    },
    sizes: {
      xs: {
        fontSize: 'xs',
      },
      sm: {
        fontSize: 'sm',
      },
      md: {
        fontSize: 'md',
      },
      lg: {
        fontSize: 'lg',
      },
    },
  },
  Form: {
    variants: {
      floating: {
        container: {
          _focusWithin: {
            label: { ...activeLabelStyles },
          },
          "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
            ...activeLabelStyles,
          },
          label: {
            top: 0,
            left: 0,
            zIndex: 2,
            position: "absolute",
            backgroundColor: "white",
            pointerEvents: "none",
            mx: 3,
            px: 1,
            my: 2,
            transformOrigin: "left top",
          },
        },
      },
    },
  },
};

const styles = {
  global: {
    body: {
      background: colors.bgDark,
      color: colors.text,
    },
    '*': {
      color: 'inherit',
    },
  },
};

const theme = extendTheme({
  colors,
  components,
  styles,
});

export default theme;
