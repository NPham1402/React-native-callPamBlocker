import {View, Text, LogBox, Linking} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  HStack,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Style from '../../assets/StyleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DetailContacts = ({route, navigation}) => {
  // const params = route.params;
  useEffect(() => {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    console.log(route);
    // console.log(params);
    navigation.setOptions({title: params.item.displayName});
  }, []);
  return (
    <View>
      <Avatar
        style={{
          marginBottom: 5,
          marginTop: 20,
          ...Style.center,
        }}
        label={params.item.displayName}
        size={100}
      />
      <Text
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
      </HStack>
    </View>
  );
};
export default function DetailContactScreens() {
  return <DetailContacts />;
}
