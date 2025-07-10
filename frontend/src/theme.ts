import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.950',
        color: 'gray.50',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'gray',
      },
      variants: {
        solid: {
          bg: 'gray.100',
          color: 'gray.900',
          _hover: {
            bg: 'gray.200',
          },
        },
        outline: {
          borderColor: 'gray.600',
          color: 'gray.100',
          _hover: {
            bg: 'gray.800',
          },
        },
      },
    },
  },
})
