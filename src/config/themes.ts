// Theme configuration for different content types and UI themes

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

// UI Theme definitions based on GitHub's color system
export const uiThemes = {
  light: {
    name: 'Light',
    colors: {
      background: 'rgb(255, 255, 255)', // pure white
      backgroundSecondary: 'rgb(255, 255, 255)', // pure white
      backgroundTertiary: 'rgb(255, 255, 255)', // pure white
      text: 'rgb(0, 0, 0)', // pure black
      textSecondary: 'rgb(0, 0, 0)', // pure black
      textMuted: 'rgb(75, 85, 99)', // gray only for muted text
      border: 'rgb(229, 231, 235)', // light border
      borderHover: 'rgb(209, 213, 219)', // subtle hover
      accent: 'rgb(59, 130, 246)', // blue accent
      accentHover: 'rgb(37, 99, 235)', // darker blue
    },
    css: {
      background: 'bg-white',
      backgroundSecondary: 'bg-white',
      backgroundTertiary: 'bg-white',
      text: 'text-black',
      textSecondary: 'text-black',
      textMuted: 'text-gray-600',
      border: 'border-gray-200',
      borderHover: 'border-gray-300',
      accent: 'text-blue-500 hover:text-blue-600',
      accentHover: 'hover:text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500 shadow-sm hover:shadow-md transition-all',
      buttonOutline: 'border-gray-200 text-black hover:bg-white hover:border-gray-300 shadow-sm hover:shadow-md transition-all',
      card: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200',
    }
  },
  
  dark: {
    name: 'Dark',
    colors: {
      background: 'rgb(17, 24, 39)', // gray-900 - dark background
      backgroundSecondary: 'rgb(17, 24, 39)', // same dark background
      backgroundTertiary: 'rgb(17, 24, 39)', // same dark background
      text: 'rgb(255, 255, 255)', // pure white text
      textSecondary: 'rgb(255, 255, 255)', // pure white text
      textMuted: 'rgb(156, 163, 175)', // gray-400 for muted text
      border: 'rgb(55, 65, 81)', // gray-700 - dark border
      borderHover: 'rgb(75, 85, 99)', // gray-600 - lighter on hover
      accent: 'rgb(96, 165, 250)', // blue-400 - bright blue for dark
      accentHover: 'rgb(59, 130, 246)', // blue-500
    },
    css: {
      background: 'bg-gray-900',
      backgroundSecondary: 'bg-gray-900',
      backgroundTertiary: 'bg-gray-900',
      text: 'text-white',
      textSecondary: 'text-white',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      borderHover: 'border-gray-600',
      accent: 'text-blue-400 hover:text-blue-300',
      accentHover: 'hover:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-lg hover:shadow-xl transition-all',
      buttonOutline: 'border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 shadow-sm hover:shadow-md transition-all',
      card: 'bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200',
    }
  },
  
  nude: {
    name: 'Nude',
    colors: {
      background: 'rgb(254, 251, 247)', // warm white
      backgroundSecondary: 'rgb(250, 245, 240)', // warm neutral
      backgroundTertiary: 'rgb(245, 237, 227)', // warm beige
      text: 'rgb(87, 83, 78)', // warm gray-800
      textSecondary: 'rgb(120, 113, 108)', // warm gray-600
      textMuted: 'rgb(168, 162, 158)', // warm gray-400
      border: 'rgb(214, 211, 209)', // warm gray-300
      borderHover: 'rgb(196, 181, 168)', // warm brown
      accent: 'rgb(180, 83, 9)', // amber-700
      accentHover: 'rgb(146, 64, 14)', // amber-800
    },
    css: {
      background: 'bg-stone-50',
      backgroundSecondary: 'bg-stone-100',
      backgroundTertiary: 'bg-stone-200',
      text: 'text-stone-800',
      textSecondary: 'text-stone-600',
      textMuted: 'text-stone-400',
      border: 'border-stone-300',
      borderHover: 'border-stone-400',
      accent: 'text-amber-700',
      accentHover: 'text-amber-800',
      button: 'bg-amber-700 hover:bg-amber-800 text-white border-amber-700',
      buttonOutline: 'border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400',
      card: 'bg-stone-50 border border-stone-300 shadow-sm hover:shadow-md transition-all duration-200',
    }
  }
};

export type ThemeType = keyof typeof themes;
export type UIThemeType = keyof typeof uiThemes;

export function getTheme(type: ThemeType) {
  return themes[type];
}

export function getUITheme(type: UIThemeType) {
  return uiThemes[type];
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

export function getUIThemeCSS(type: UIThemeType) {
  const theme = uiThemes[type];
  return {
    '--ui-background': theme.colors.background,
    '--ui-background-secondary': theme.colors.backgroundSecondary,
    '--ui-background-tertiary': theme.colors.backgroundTertiary,
    '--ui-text': theme.colors.text,
    '--ui-text-secondary': theme.colors.textSecondary,
    '--ui-text-muted': theme.colors.textMuted,
    '--ui-border': theme.colors.border,
    '--ui-border-hover': theme.colors.borderHover,
    '--ui-accent': theme.colors.accent,
    '--ui-accent-hover': theme.colors.accentHover,
  } as React.CSSProperties;
}
