import {View, Text, TouchableOpacity} from 'react-native';
import {Appearance, AsyncStorage} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  HStack,
  ListItem,
  Provider,
  Switch,
} from '@react-native-material/core';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {storage} from '../store/mmkv';
import {AppContext} from '../store/darkModeContext';
export default function SettingScreens({navigation}) {
  const [isDarkMode, setIsDarkMode] = useState(null);

  const {t, i18n} = useTranslation();

  const [tab, setTab] = useState(1);

  const {theme, setTheme} = React.useContext(AppContext);

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => {
        storage.set('language', value);
      })
      .catch(err => console.log(err));
  };

  const choseLanguage = () => {
    if (storage.getString('language') === 'vi') {
      setTab(1);
    } else {
      setTab(2);
    }
  };

  const choseDarkmode = () => {
    if (isDarkMode === null) {
      if (storage.getString('theme') === 'light') setIsDarkMode(false);
      else setIsDarkMode(true);
    }
    if (isDarkMode === false) {
      setTheme('light');
      storage.set('theme', 'light');
    } else {
      setTheme('dark');
      storage.set('theme', 'dark');
    }
  };

  useLayoutEffect(() => {
    choseLanguage();
  }, []);

  useLayoutEffect(() => {
    choseDarkmode();
  }, [isDarkMode]);

  useLayoutEffect(() => {
    if (tab === 1) {
      changeLanguage('vi');
    } else {
      changeLanguage('en');
    }
  }, [tab]);

  return (
    <Provider>
      <View
        style={{
          top: 50,
        }}>
        <Text style={{fontSize: 30, fontWeight: 800, left: 20, right: 20}}>
          {t('setting')}
        </Text>
        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            width: '90%',
            alignContent: 'center',
            left: 20,
            right: 20,
            borderRadius: 40,
          }}>
          <ListItem
            style={{margin: 50}}
            title={!isDarkMode ? t('light') : t('dark')}
            overline={'DarkMode'}
            leading={
              <Entypo
                name="light-bulb"
                size={24}
                color={!isDarkMode ? '#FFBF00' : 'black'}
              />
            }
            trailing={props => (
              <Switch
                value={isDarkMode}
                onValueChange={() => setIsDarkMode(!isDarkMode)}
                {...props}
              />
            )}
          />

          {/* <ListItem
            title="Scan"
            leading={<FontAwesome5 name="qrcode" size={24} color="black" />}
            trailing={props => (
              <MaterialCommunityIcons
                name="chevron-right"
                onPress={() => setVisible(true)}
                {...props}
              />
            )}
            onPress={() => navigation.navigate('camera')}
          /> */}
        </View>
        {/* <HStack
          p={4}
          style={{
            position: 'absolute',
            top: 200,
            left: 20,
            right: 20,
            backgroundColor: 'white',
            height: 80,
            borderRadius: 12,
          }}>
          <View
            style={{
              top: 15,
              left: 20,
              width: '100%',
            }}>
            <Text style={{fontSize: 20, fontWeight: 600}}>Dark Mode</Text>
            <Text style={{fontSize: 14, fontWeight: 300}}>
              {!isDarkMode ? 'Light' : 'Dark'}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            style={{right: 50}}
          />
        </HStack> */}
        <HStack
          style={{
            backgroundColor: 'white',
            marginLeft: 20,
            marginRight: 20,
            borderColor: 'white',
            borderWidth: 0.5,
            borderRadius: 12,
          }}
          m={4}
          spacing={6}>
          <TouchableOpacity
            onPress={() => {
              setTab(1);
            }}
            style={{
              backgroundColor: tab === 1 ? 'cyan' : 'white',
              borderWidth: 0.5,
              borderRadius: 12,
              borderColor: 'white',
              height: 40,
              width: '50%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                textAlign: 'center',
                paddingTop: 7,
                color: 'black',
              }}>
              Tiếng việt
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTab(2);
            }}
            style={{
              backgroundColor: tab === 2 ? 'cyan' : 'white',
              borderWidth: 0.5,
              borderRadius: 12,
              borderColor: 'white',
              height: 40,
              width: '50%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                textAlign: 'center',
                paddingTop: 7,
                color: 'black',
              }}>
              English
            </Text>
          </TouchableOpacity>
        </HStack>
      </View>
    </Provider>
  );
}
