import {View, Text} from 'react-native';
import React from 'react';
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
export default function NavigationScreen() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 20,
          right: 20,
          elevation: 0,

          backgroundColor: '#ffffff',
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
                color={focused ? '#00FFFF' : '#748c94'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#748c94',
                  fontSize: 12,
                }}>
                Home
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
                color={focused ? '#00FFFF' : '#748c94'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#748c94',
                  fontSize: 12,
                }}>
                Blocklist
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add Block"
        component={AddBlockScreens}
        options={{
          tabBarIcon: () => <AntDesign name="plus" size={32} color="white" />,
          tabBarButton: props => (
            <TouchableOpacity
              style={{
                top: -30,
                justifyContent: 'center',
                alignContent: 'center',
                ...Style.shadow,
              }}
              onPress={props.onPress}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: '#00FFFF',
                }}>
                {props.children}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
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
                color={focused ? '#00FFFF' : '#748c94'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#748c94',
                  fontSize: 12,
                }}>
                Contact
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreens}
        options={{
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
                color={focused ? '#00FFFF' : '#748c94'}
              />
              <Text
                style={{
                  color: focused ? '#00FFFF' : '#748c94',
                  fontSize: 12,
                }}>
                Setting
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
