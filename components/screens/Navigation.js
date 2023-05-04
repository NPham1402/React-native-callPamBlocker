import {View, Text, NativeModules} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Style from '../assets/StyleSheet';
import HomeScreen from './HomeScreen';
import BlockListScreen from './BlockListScreen';
import AddBlockScreens from './AddBlockScreens';
import ContactScreen from './contact/ContactScreen';
import SettingScreens from './SettingScreens';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {AppContext} from '../store/darkModeContext';
import {showMessage} from 'react-native-flash-message';
import {Platform} from 'react-native';

export default function NavigationScreen({navigation}) {
  const Tab = createBottomTabNavigator();

  const {t} = useTranslation();

  const {theme} = React.useContext(AppContext);

  const nativeModules = NativeModules.ControlPhone;

  const OsVer = Platform.constants['Release'];

  const checkBlockPermission = async () => {
    if (OsVer > 10) {
      const result = await nativeModules.checkRequestBlock();
      if (result === false)
        showMessage({
          description:
            'Please go to settings and accept permission if you want block the Spam Call',
          message: "You didn't  accept permission",
          type: 'danger',
          floating: true,
          icon: 'danger',
          duration: 2000,
          onPress: () => {
            navigation.navigate('Setting');
          },
        });
    } else {
      showMessage({
        message: "Your android's verion this not support",
        type: 'danger',
        floating: true,
        icon: 'danger',
        duration: 2000,
        onPress: () => {
          navigation.navigate('Setting');
        },
      });
    }
  };

  useEffect(() => {
    checkBlockPermission();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 20,
          right: 20,
          elevation: 0,

          backgroundColor: theme === 'light' ? 'white' : '#C8C8C8',
          borderRadius: 15,
          height: 90,
          ...Style.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 5,
              }}>
              <AntDesign
                name="home"
                size={25}
                color={focused ? '#00FFFF' : '#3F3F3F'}
              />

              <Text
                style={{
                  color: focused ? '#00FFFF' : '#3F3F3F',
                  fontSize: 12,
                }}>
                {t('home')}
              </Text>
            </View>
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="BlockList"
        component={BlockListScreen}
        options={{
          lazy: true,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 5,
              }}>
              <Ionicons
                name="list"
                size={25}
                color={focused ? '#00FFFF' : '#3F3F3F'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#3F3F3F',
                  fontSize: 12,
                }}>
                {t('history')}
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Add Block"
        component={AddBlockScreens}
        options={{
          tabBarIcon: () => <AntDesign name="plus" size={32} color="white" />,
          tabBarButton: props => (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                ...Style.shadow,
              }}
              onPress={props.onPress}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 35,
                  backgroundColor: theme === 'light' ? '#00FFFF' : '748c94',
                }}>
                {props.children}
              </View>
            </TouchableOpacity>
          ),
        }}
      /> */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          lazy: true,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 5,
              }}>
              <AntDesign
                name="contacts"
                size={25}
                color={focused ? '#00FFFF' : '#3F3F3F'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#3F3F3F',
                  fontSize: 12,
                }}>
                {t('contact')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreens}
        options={{
          lazy: true,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 5,
              }}>
              <AntDesign
                name="setting"
                size={25}
                color={focused ? '#00FFFF' : '#3F3F3F'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#3F3F3F',
                  fontSize: 12,
                }}>
                {t('setting')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
