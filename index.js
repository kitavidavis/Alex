/**
 * @format
 */

import * as React from "react";
import {AppRegistry} from 'react-native';
import { Provider as PaperProvider, DarkTheme, DefaultTheme, configureFonts } from 'react-native-paper';
import App from './App';
import {name as appName} from './app.json';
import { NativeBaseProvider } from 'native-base';

const fontConfig = {
    customVariant: {
      fontFamily: Platform.select({
        web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        ios: 'System',
        default: 'Roboto',
      }),
      fontWeight: '400',
      letterSpacing: 0.5,
      lineHeight: 22,
      fontSize: 18,
    }
  };
  
  
  
  const theme = {
    ...DarkTheme,
    fonts: configureFonts({config: fontConfig}),
    version: 3,
    colors: {
        "primary": "rgb(76, 218, 218)",
        "onPrimary": "rgb(0, 55, 55)",
        "primaryContainer": "rgb(0, 79, 79)",
        "onPrimaryContainer": "rgb(111, 247, 246)",
        "secondary": "rgb(176, 204, 203)",
        "onSecondary": "rgb(27, 53, 52)",
        "secondaryContainer": "rgb(50, 75, 75)",
        "onSecondaryContainer": "rgb(204, 232, 231)",
        "tertiary": "rgb(179, 200, 232)",
        "onTertiary": "rgb(28, 49, 75)",
        "tertiaryContainer": "rgb(51, 72, 99)",
        "onTertiaryContainer": "rgb(211, 228, 255)",
        "error": "rgb(255, 180, 171)",
        "onError": "rgb(105, 0, 5)",
        "errorContainer": "rgb(147, 0, 10)",
        "onErrorContainer": "rgb(255, 180, 171)",
        "background": "rgb(25, 28, 28)",
        "onBackground": "rgb(224, 227, 226)",
        "surface": "rgb(25, 28, 28)",
        "onSurface": "rgb(224, 227, 226)",
        "surfaceVariant": "rgb(63, 73, 72)",
        "onSurfaceVariant": "rgb(190, 201, 200)",
        "outline": "rgb(136, 147, 146)",
        "outlineVariant": "rgb(63, 73, 72)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(224, 227, 226)",
        "inverseOnSurface": "rgb(45, 49, 49)",
        "inversePrimary": "rgb(0, 106, 106)",
        "elevation": {
          "level0": "transparent",
          "level1": "rgb(28, 38, 38)",
          "level2": "rgb(29, 43, 43)",
          "level3": "rgb(31, 49, 49)",
          "level4": "rgb(31, 51, 51)",
          "level5": "rgb(32, 55, 55)"
        },
        "surfaceDisabled": "rgba(224, 227, 226, 0.12)",
        "onSurfaceDisabled": "rgba(224, 227, 226, 0.38)",
        "backdrop": "rgba(41, 50, 50, 0.4)"
      }
  };

export default function Main() {
    return (
      <PaperProvider theme={theme}>
        <NativeBaseProvider>
            <App />
        </NativeBaseProvider>
      </PaperProvider>
    );
  }
  
  AppRegistry.registerComponent(appName, () => Main);