import {View, Text} from 'react-native';
import React, {useState} from 'react';
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
export default function SettingScreens({navigation}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <Provider>
      <View style={{top: 50}}>
        <Text style={{fontSize: 30, fontWeight: 800, left: 20, right: 20}}>
          Settings
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
            title={!isDarkMode ? 'Light' : 'Dark'}
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
          <ListItem
            title="language"
            leading={<FontAwesome5 name="language" size={24} color="black" />}
            trailing={props => (
              <MaterialCommunityIcons
                name="chevron-right"
                onPress={() => setVisible(true)}
                {...props}
              />
            )}
          />
          <ListItem
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
          />
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
        <Dialog visible={visible} onDismiss={() => setVisible(true)}>
          <DialogHeader title="Dialog Header" />
          <DialogContent>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum
              eligendi inventore, laboriosam laudantium minima minus nesciunt
              pariatur sequi.
            </Text>
          </DialogContent>
          <DialogActions>
            <Button
              title="Cancel"
              compact
              variant="text"
              onPress={() => setVisible(false)}
            />
            <Button
              title="Ok"
              compact
              variant="text"
              onPress={() => setVisible(false)}
            />
          </DialogActions>
        </Dialog>
      </View>
    </Provider>
  );
}
