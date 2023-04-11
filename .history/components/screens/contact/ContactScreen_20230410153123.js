import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  LogBox,
  Linking,
} from 'react-native';
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

const Stack = createNativeStackNavigator();

const ListContact = ({navigation}) => {
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
      <View style={{left: 20, right: 20, display: 'flex'}}>
        <HStack m={4} spacing={6}>
          <Text style={{fontSize: 30, fontWeight: 800}}>Contact</Text>
          <IconButton
            onPress={() => {
              Linking.openURL(`tel:${params.item.phoneNumbers[0].number}`);
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
                navigation.navigate('ContactDetail', contact);
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
};
const DetailContacts = ({route, navigation}) => {
  const params = route.params;
  useEffect(() => {
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
    console.log(params);
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

export default function ContactScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactList"
        component={ListContact}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ContactDetail" component={DetailContacts} />
    </Stack.Navigator>
  );
}
