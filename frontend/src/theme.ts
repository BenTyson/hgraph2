import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  fonts: {
    heading: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    body: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
        fontFamily: 'body',
        lineHeight: '1.6',
        fontSize: '15px',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: '8px',
        fontSize: '14px',
      },
      variants: {
        solid: {
          bg: 'blue.600',
          color: 'white',
          _hover: {
            bg: 'blue.700',
            transform: 'translateY(-1px)',
            shadow: 'lg',
            _disabled: {
              bg: 'blue.600',
              transform: 'none',
              shadow: 'none',
            },
          },
          _active: {
            bg: 'blue.800',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        },
        outline: {
          borderColor: 'gray.300',
          color: 'gray.700',
          bg: 'white',
          _hover: {
            bg: 'gray.50',
            borderColor: 'gray.400',
            transform: 'translateY(-1px)',
            shadow: 'md',
          },
          transition: 'all 0.2s ease',
        },
        ghost: {
          color: 'gray.600',
          _hover: {
            bg: 'gray.100',
            color: 'gray.800',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: '12px',
          shadow: 'sm',
          border: '1px solid',
          borderColor: 'gray.200',
          _hover: {
            shadow: 'md',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: '600',
      },
      sizes: {
        xs: {
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600',
          color: 'gray.600',
        },
        sm: {
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          fontWeight: '600',
          color: 'gray.700',
        },
        md: {
          fontSize: '20px',
          fontWeight: '600',
          color: 'gray.900',
        },
        lg: {
          fontSize: '28px',
          fontWeight: '600',
          color: 'gray.900',
        },
        xl: {
          fontSize: '36px',
          fontWeight: '700',
          color: 'gray.900',
        },
      },
    },
    Table: {
      variants: {
        simple: {
          table: {
            bg: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
          },
          thead: {
            tr: {
              bg: 'gray.50',
            },
            th: {
              borderColor: 'gray.200',
              color: 'gray.600',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              py: 4,
            },
          },
          tbody: {
            tr: {
              borderColor: 'gray.200',
              _hover: {
                bg: 'gray.50',
              },
            },
            td: {
              borderColor: 'gray.200',
              py: 4,
              fontSize: '14px',
            },
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            borderRadius: '8px',
            fontSize: '14px',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.500',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            borderRadius: '8px',
            fontSize: '14px',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.500',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '500',
        px: 2,
        py: 1,
      },
      variants: {
        subtle: {
          bg: 'gray.100',
          color: 'gray.800',
        },
      },
    },
    Stat: {
      baseStyle: {
        label: {
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600',
          color: 'gray.600',
        },
        number: {
          fontSize: '24px',
          fontWeight: '600',
          color: 'gray.900',
        },
        helpText: {
          fontSize: '12px',
          color: 'gray.500',
        },
      },
    },
  },
})
