import {View, Text, LogBox, TouchableOpacity, Linking} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  HStack,
  Icon,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Style from '../../assets/StyleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
const DetailContacts = ({navigation}) => {
  const route = useRoute();
  const params = route.params;
  useEffect(() => {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    // if (params.AddContact === true)
    //   navigation.setOptions({title: 'Add Contact'});
    // else navigation.setOptions({title: params.item.displayName});
  }, []);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            console.log(image);
          });
        }}
        style={{
          marginBottom: 5,
          marginTop: 20,
          ...Style.center,
        }}>
        <Avatar
          autoColor
          label={params.AddContact === false && params.item.displayName}
          icon={props => <AntDesign name="adduser" {...props} />}
          size={100}
        />
      </TouchableOpacity>
      {/* <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000000',
          ...Style.center,
        }}>
        {params.item.displayName}
      </Text>
      <HStack m={4} spacing={50} style={{...Style.center}}>
        <IconButton
          onPress={() => {
            Linking.openURL(`tel:${params.item.phoneNumbers[0].number}`);
          }}
          icon={props => (
            <View>
              <AntDesign name="phone" {...props} />
            </View>
          )}
        />
        <IconButton
          onPress={() => {
            Linking.openURL(
              `sms:${params.item.phoneNumbers[0].number}?body=Enter Your Message`,
            );
          }}
          icon={props => <MaterialIcons name="sms" {...props} />}
        />
        <IconButton icon={props => <MaterialIcons name="block" {...props} />} />
      </HStack>
      <HStack
        p={4}
        style={{
          marginBottom: 5,
          marginTop: 20,
          ...Style.center,
          backgroundColor: 'white',
          height: 80,
          borderRadius: 12,
          width: '90%',
        }}>
        <View
          style={{
            top: 15,
            left: 20,
            width: '100%',
          }}>
          <Text style={{fontSize: 20, fontWeight: 600, color: '#000000'}}>
            Number Phone:
          </Text>
          <Text style={{fontSize: 16, fontWeight: 400, color: '#000000'}}>
            {params.item.phoneNumbers.length === 0 ? (
              <Text>Not number</Text>
            ) : (
              <Text>{params.item.phoneNumbers[0].number}</Text>
            )}
          </Text>
        </View>
      </HStack> */}
    </View>
  );
};
export default function DetailContactScreens() {
  return <DetailContacts />;
}
