import {View, Text, FlatList, PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Avatar,
  HStack,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Stack = createNativeStackNavigator();

const ListContact = ({navigation}) => {
  const [contacts, setContacts] = useState([]);

  const requestReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Read Phone State');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useLayoutEffect(() => {
    requestReadPermission();
  }, []);
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }
  }, []);

  const openContact = contact => {
    console.log(JSON.stringify(contact));
    Contacts.openExistingContact(contact);
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(contactss => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() < b.givenName.toLowerCase(),
        );
        setContacts(contactss);
        console.log(contactss[0].displayName);
      })
      .catch(e => {
        alert('Permission to access contacts was denied');
        console.warn('Permission to access contacts was denied', e);
      });
  };

  const search = text => {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
      });
    }
  };

  return (
    <View style={{top: 50}}>
      <View style={{left: 20, right: 20, display: 'flex'}}>
        <HStack m={4} spacing={6}>
          <Text style={{fontSize: 30, fontWeight: 800}}>Contact</Text>
          <IconButton
            onPress={() => {
              navigation.navigate('ContactDetail', {AddContact: true});
            }}
            icon={props => (
              <View>
                <AntDesign name="adduser" {...props} />
              </View>
            )}
          />
        </HStack>
      </View>
      <TextInput
        label="Search"
        variant="outlined"
        style={{
          width: '90%',
          alignContent: 'center',
          left: 20,
          right: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
        onChangeText={search}
      />
      <FlatList
        data={contacts}
        style={{
          width: '90%',
          alignContent: 'center',
          left: 20,
          right: 20,
          borderRadius: 40,
        }}
        renderItem={contact => {
          return (
            <ListItem
              onPress={() => {
                navigation.navigate('ContactDetail', {
                  AddContact: false,
                  data: contact,
                });
              }}
              leadingMode="avatar"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              key={contact.item.lookupKey}
              leading={<Avatar label={contact.item.displayName} />}
              title={contact.item.displayName}
              secondaryText={
                contact.item.phoneNumbers.length === 0 ? (
                  <Text>Not number</Text>
                ) : (
                  <Text>{contact.item.phoneNumbers[0].number}</Text>
                )
              }
            />
          );
        }}
        keyExtractor={item => item.recordID}
      />
    </View>
  );
};

export default function ContactScreen({navigation}) {
  return <ListContact navigation={navigation} />;
}
