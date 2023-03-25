import {View, Text, FlatList, PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useState} from 'react';
import {Avatar, ListItem, TextInput} from '@react-native-material/core';
export default function ContactScreen() {
  const [contacts, setContacts] = useState([]);

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
      .then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() < b.givenName.toLowerCase(),
        );
        setContacts(contacts);
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
      <Text style={{fontSize: 30, fontWeight: 800, left: 20, right: 20}}>
        Settings
      </Text>
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
      {/* {contacts.map((data, number) => {
        return (
          <View>
            <ListItem
              leadingMode="avatar"
              key={data.lookupKey}
              leading={<Avatar label={data.firstName + "" + data.lastName} />}
              title={data.firstName + "" + data.lastName}
              secondaryText={data.phoneNumbers[0].number}
            />
          </View>
        );
      })} */}
    </View>
  );
}
