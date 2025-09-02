// Theme configuration for different content types

export const themes = {
  blog: {
    name: 'Blog',
    primary: 'green',
    colors: {
      primary: 'rgb(34, 197, 94)', // green-500
      primaryHover: 'rgb(22, 163, 74)', // green-600
      primaryLight: 'rgb(240, 253, 244)', // green-50
      primaryBorder: 'rgb(187, 247, 208)', // green-200
      accent: 'rgb(16, 185, 129)', // emerald-500
      text: 'rgb(5, 150, 105)', // emerald-600
    },
    css: {
      badge: 'text-green-700 border-green-200 bg-green-50',
      button: 'bg-green-600 hover:bg-green-700',
      buttonOutline: 'border-green-500 text-green-600 hover:bg-green-50',
      link: 'text-green-600 hover:text-green-700',
      focus: 'focus:ring-green-500 focus:border-green-500',
    }
  },
  
  news: {
    name: 'News',
    primary: 'blue',
    colors: {
      primary: 'rgb(59, 130, 246)', // blue-500
      primaryHover: 'rgb(37, 99, 235)', // blue-600
      primaryLight: 'rgb(239, 246, 255)', // blue-50
      primaryBorder: 'rgb(191, 219, 254)', // blue-200
      accent: 'rgb(99, 102, 241)', // indigo-500
      text: 'rgb(79, 70, 229)', // indigo-600
    },
    css: {
      badge: 'text-blue-700 border-blue-200 bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonOutline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
      link: 'text-blue-600 hover:text-blue-700',
      focus: 'focus:ring-blue-500 focus:border-blue-500',
    }
  },

  exercises: {
    name: 'Exercises',
    primary: 'purple',
    colors: {
      primary: 'rgb(168, 85, 247)', // purple-500
      primaryHover: 'rgb(147, 51, 234)', // purple-600
      primaryLight: 'rgb(250, 245, 255)', // purple-50
      primaryBorder: 'rgb(221, 214, 254)', // purple-200
      accent: 'rgb(236, 72, 153)', // pink-500
      text: 'rgb(219, 39, 119)', // pink-600
    },
    css: {
      badge: 'text-purple-700 border-purple-200 bg-purple-50',
      button: 'bg-purple-600 hover:bg-purple-700',
      buttonOutline: 'border-purple-500 text-purple-600 hover:bg-purple-50',
      link: 'text-purple-600 hover:text-purple-700',
      focus: 'focus:ring-purple-500 focus:border-purple-500',
    }
  }
};

export type ThemeType = keyof typeof themes;

export function getTheme(type: ThemeType) {
  return themes[type];
}

// CSS custom properties for dynamic theming
export function getThemeCSS(type: ThemeType) {
  const theme = themes[type];
  return {
    '--theme-primary': theme.colors.primary,
    '--theme-primary-hover': theme.colors.primaryHover,
    '--theme-primary-light': theme.colors.primaryLight,
    '--theme-primary-border': theme.colors.primaryBorder,
    '--theme-accent': theme.colors.accent,
    '--theme-text': theme.colors.text,
  } as React.CSSProperties;
}
