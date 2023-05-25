import {View, Text} from 'react-native';
import {Platform, NativeModules,  useWindowDimensions} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Button,
  Divider,
  ListItem,
  Provider,
  Switch,
} from '@react-native-material/core';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import {storage} from '../store/mmkv';
import {AppContext} from '../store/darkModeContext';
import SelectLanguage from '../objects/SelectLanguage';
export default function SettingScreens({navigation}) {
  const [isDarkMode, setIsDarkMode] = useState(null);

  const {t, i18n} = useTranslation();

  const OsVer = Platform.constants['Release'];

  const [result, setResult] = useState(false);

  const nativeModules = NativeModules.ControlPhone;
  const checkBlockPermission = async () => {
    if (OsVer > 10) {
      setResult(storage.getBoolean("check"));
    }
  };

  const {theme, setTheme} = React.useContext(AppContext);

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
    choseDarkmode();
    checkBlockPermission();
  }, [isDarkMode]);

  const {height}=useWindowDimensions()

  return (
    <Provider>
      
           <View
      style={{
        backgroundColor: theme === 'dark' ? '#3F3F3F' : '#f0f8ff',
        height,
      }}>
        <View   style={{
          height:height-110,
        }}>

        <Text style={{fontSize: 30, fontWeight: 800, left: 20, right: 20,color:theme==="dark"?"white":"black"}}>
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
        <SelectLanguage />

        {OsVer > 10 && result === false && (
          <View>
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'red',
                  textAlign: 'center',
                  
                  paddingLeft: 15,
                  
                  paddingBottom: 20,
                }}>
                {t('requestPermission')}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'red',
                  textAlign: 'center',
                  paddingLeft: 15,
                  
                  paddingBottom: 20,
                }}>
                {t('requestPermissionDecription')}
              </Text>
              <Button
                color={'red'}
                onPress={() => {
                  nativeModules.requestBlock();
                }}
                title={t('requestPermissionPress')}
                />
            </View>
          </View>
        )}
        </View>
      </View>
    </Provider>
  );
}
