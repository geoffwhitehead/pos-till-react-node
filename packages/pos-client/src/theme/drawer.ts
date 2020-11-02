import { colors } from './colors';

export const defaultTheme = {
  dark: false,
  colors: {
    primary: colors.theme.highlightBlue,
    background: colors.theme.white,
    card: 'rgb(255, 255, 255)',
    text: colors.theme.white,
    border: colors.theme.white,
    notification: 'rgb(255, 69, 58)',
  },
};

// dark (boolean): Whether this is a dark theme or a light theme
// colors (object): Various colors used by react navigation components:
//     primary (string): The primary color of the app used to tint various elements. Usually you'll want to use your brand color for this.
//     background (string): The color of various backgrounds, such as background color for the screens.
//     card (string): The background color of card-like elements, such as headers, tab bars etc.
//     text (string): The text color of various elements.
//     border (string): The color of borders, e.g. header border, tab bar border etc.
//     notification (string): The color of Tab Navigator badge.
