/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect} from 'react';
import {
  NativeModules,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationScreen from './components/screens/Navigation';
import DetailContactScreens from './components/screens/contact/DetailContactScreens';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import QrScreen from './components/screens/QrScreen';
import {useTranslation} from 'react-i18next';
import {storage} from './components/store/mmkv';
import {AppContextProvider} from './components/store/darkModeContext';
import TutoriralScreen from './components/screens/TutorialScreen';

function App() {
  const {i18n} = useTranslation();

  const changeLanguage = value => {
    i18n.changeLanguage(value).catch(err => console.log(err));
  };

  const handleLanguage = () => {
    if (storage.getString('language') === undefined) {
      storage.set('language', 'en');
    } else {
      changeLanguage(storage.getString('language'));
    }
  };

  const handleIdPhone = async () => {
    if (storage.getString('id') === undefined) {
      const native = NativeModules.ControlPhone;
      const id = await native.getIdDevice();
      storage.set('id', id);
    }
  };

  useLayoutEffect(() => {
    handleLanguage();
    handleIdPhone();
  }, []);

  const Stack = createNativeStackNavigator();
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={
            storage.getBoolean('tutorial') === true ? 'navigation' : 'tutorial'
          }
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="navigation" component={NavigationScreen} />
          <Stack.Screen name="tutorial" component={TutoriralScreen} />
          <Stack.Screen name="ContactDetail" component={DetailContactScreens} />
          <Stack.Screen name="qrcode" component={QrScreen} />
        </Stack.Navigator>
        <StatusBar hidden={true} />
        <FlashMessage position="top" />
      </NavigationContainer>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
