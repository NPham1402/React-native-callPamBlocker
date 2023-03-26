/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Style from './components/assets/StyleSheet';
import HomeScreen from './components/screens/HomeScreen';
import BlockListScreen from './components/screens/BlockListScreen';
import AddBlockScreens from './components/screens/AddBlockScreens';
import ContactScreen from './components/screens/ContactScreen';
import SettingScreens from './components/screens/SettingScreens';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      });
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        },
      );
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        },
      )
    }
  }, []);

  const Tab = createBottomTabNavigator();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
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
      <StatusBar hidden={true} />
    </NavigationContainer>
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
