/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View
} from 'react-native';
import changeNavigationBarColor, { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { BottomNavigation, Appbar, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { LOCAL_STORAGE_NAME } from './src/constants';
import Home from './src/Home';
import SplashScreen from 'react-native-splash-screen';

function App(): JSX.Element {
  const [isExtended, setIsExtended] = React.useState(true);
  const theme = useTheme();

  useEffect(() => {
    changeNavigationBarColor("#191C1C");
    showNavigationBar()
  }, [])

  const prepareStorageService = async () => {
    try {
      const value = await AsyncStorage.getItem(LOCAL_STORAGE_NAME);
      if(value !== null) {
        // the store already exixts;
      } else {
        // lets prepare the store coz it does not exists
        await AsyncStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify([])) // setting empty value
      }

      SplashScreen.hide();
    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    // prepare storage service
    prepareStorageService();
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={"#191C1C"}
      />
      <Appbar.Header style={{backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline, borderBottomWidth: 1}}>
        <Appbar.Content title="Geo" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
          <Home />
      </View>
    </SafeAreaView>
  );
}


export default App;
