import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  SectionList,
  NativeModules,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Linking,
} from 'react-native';
import Octions from 'react-native-vector-icons/Octicons';
import Contacts from 'react-native-contacts';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Chip,
  HStack,
  IconButton,
  ListItem,
  TextInput,
  VStack,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Style from '../../assets/StyleSheet';
import {useTranslation} from 'react-i18next';
import {checkPhoneNumberBlock, startCall} from '../../objects/MiniFuntions';

const Stack = createNativeStackNavigator();

const ListContact = ({navigation}) => {
  const nativeModules = NativeModules.ControlPhone;

  const conTactTemplate = {
    company: '',
    department: '',
    displayName: '',
    emailAddresses: [],
    familyName: '',
    givenName: '',
    hasThumbnail: false,
    imAddresses: [],
    isStarred: false,
    jobTitle: '',
    middleName: '',
    note: '',
    number: '',
    phoneNumbers: [],
    postalAddresses: [],
    prefix: null,
    rawContactId: '',
    recordID: '',
    suffix: null,
    thumbnailPath: '',
    urlAddresses: [],
  };

  const [contacts, setContacts] = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const [tab, setTab] = useState(1);

  const {t} = useTranslation();

  useEffect(() => {
    setContacts(null);
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        },
      ).then(result => {
        if (result['android.permission.READ_CONTACTS'] === 'granted') {
          if (tab === 1) loadContacts();
          else loadBlockPhone();
        }
      });
    } else {
      loadContacts();
    }
  }, [tab]);

  const createContacts = () => {
    Contacts.openContactForm(conTactTemplate);
  };

  const OsVer = Platform.constants['Release'];

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        setContacts(
          contacts
            .sort(
              (a, b) =>
                a.displayName.toLowerCase() < b.displayName.toLowerCase(),
            )
            .filter(item => item.phoneNumbers.length !== 0)
            .map(item => {
              return {
                ...item,
                number: item.phoneNumbers[0].number,
              };
            }),
        );
      })
      .catch(e => {
        alert(e);
      });
  };

  const loadBlockPhone = async () => {
    const blockPhone = await nativeModules.getAllBlockPhones();
    console.debug(blockPhone);
    setContacts(JSON.parse(blockPhone));
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

  const onRefresh = React.useCallback(() => {
    setContacts(null);
    setTimeout(() => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
          {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
          },
        ).then(result => {
          if (result['android.permission.READ_CONTACTS'] === 'granted') {
            if (tab === 1) loadContacts();
            else loadBlockPhone();
          }
        });
      } else {
        loadContacts();
      }
    }, 500);
  }, []);

  return (
    <View style={{top: 50}}>
      <View style={{left: 20, right: 20, display: 'flex'}}>
        <HStack m={4} spacing={6}>
          <Text style={{fontSize: 30, fontWeight: 800}}>{t('contact')}</Text>
          <IconButton
            onPress={() => {
              createContacts();
            }}
            icon={props => <AntDesign name="adduser" {...props} />}
          />
        </HStack>
      </View>
      <HStack
        style={{
          backgroundColor: 'white',
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 10,
          borderColor: 'white',
          borderWidth: 0.5,
          borderRadius: 12,
        }}
        m={4}
        spacing={6}>
        <TouchableOpacity
          onPress={() => {
            setTab(1);
          }}
          style={{
            backgroundColor: tab === 1 ? 'cyan' : 'white',
            borderWidth: 0.5,
            borderRadius: 12,
            borderColor: 'white',
            height: 40,
            width: '50%',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 800,
              textAlign: 'center',
              paddingTop: 7,
              color: 'black',
            }}>
            {t('contact')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTab(2);
          }}
          style={{
            backgroundColor: tab === 2 ? 'cyan' : 'white',
            borderWidth: 0.5,
            borderRadius: 12,
            borderColor: 'white',
            height: 40,
            width: '50%',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 800,
              textAlign: 'center',
              paddingTop: 7,
              color: 'black',
            }}>
            {t('blocklist')}
          </Text>
        </TouchableOpacity>
      </HStack>
      {tab === 1 && (
        <TextInput
          label={t('search')}
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
      )}
      <View style={{marginLeft: 20, marginRight: 20}}>
        {tab === 2 && OsVer < 10 ? (
          <Text>not Support</Text>
        ) : contacts ? (
          <View>
            <FlatList
              onEndReachedThreshold={10}
              data={contacts}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({item}) => (
                <Listitem
                  contact={item}
                  tab={tab}
                  nativeModules={nativeModules}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
        ) : (
          // contacts.map((contact, index) => (
          //   <View key={index}>
          //     <Listitem contact={contact} tab={tab} navigation={navigation} />
          //   </View>
          // ))
          <ActivityIndicator style={Style.container} size={'large'} />
        )}
      </View>
    </View>
  );
};

const Listitem = React.memo(data => {
  const [showMore, setShowMore] = useState(false);
  const {contact, index, nativeModules, tab} = data;

  const [isBlock, setIsBlock] = useState(false);
  const {t} = useTranslation();

  const openViewContact = contact => {
    Contacts.viewExistingContact(contact);
  };

  const openEditContact = contact => {};
  const handleBlock = async Number => {
    nativeModules.checKBlockPhone(Number).then(data => setIsBlock(data));
  };

  useLayoutEffect(() => {
    handleBlock(contact.number);
  }, []);

  return (
    <View>
      <ListItem
        leadingMode="avatar"
        style={{
          left: 20,
          right: 20,
          marginLeft: 10,
          borderWidth: 100,
          marginRight: 10,
        }}
        key={index}
        trailing={props => (
          <IconButton
            {...props}
            onPress={() => {
              setShowMore(!showMore);
            }}
            icon={props => (
              <AntDesign name={showMore ? 'up' : 'down'} {...props} />
            )}
          />
        )}
        leading={
          <Avatar
            image={contact.thumbnailPath && {uri: contact.thumbnailPath}}
            label={contact.displayName}
          />
        }
        title={
          <Text style={{fontSize: 20, fontWeight: 800, color: 'black'}}>
            {contact.displayName}
          </Text>
        }
        secondaryText={
          <View>
            <Text>{contact.number}</Text>
          </View>
        }
      />
      {showMore === true && (
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: 20,
            alignItems: 'center',
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12,
          }}>
          {data.tab === 1 && !isBlock ? (
            <HStack style={{paddingTop: 4}}>
              <IconButton
                color="#B284BE"
                onPress={() => {
                  openEditContact(contact);
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons color="#B284BE" name="settings" {...props} />
                    <Text style={{color: '#B284BE', fontSize: 12}}>
                      {t('edit')}
                    </Text>
                  </View>
                )}
              />
              <IconButton
                onPress={async () => {
                  openViewContact(contact);
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons name="contact-page" {...props} />
                    <Text style={{color: 'black', fontSize: 12}}>
                      {t('view')}
                    </Text>
                  </View>
                )}
              />
              <IconButton
                color="green"
                onPress={() => {
                  startCall(contact.number);
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <AntDesign name={'phone'} {...props} />
                    <Text style={{color: 'green', marginTop: 3, fontSize: 12}}>
                      {t('call')}
                    </Text>
                  </View>
                )}
              />
              <IconButton
                color="brown"
                onPress={() => {
                  Linking.openURL(
                    'sms:' + contact.number + '?body=Enter your Message',
                  );
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons size={60} name="sms" {...props} />
                    <Text style={{color: '#CC9966', fontSize: 12}}>SMS</Text>
                  </View>
                )}
              />
              <IconButton
                color="red"
                onPress={async () => {
                  data.navigation.navigate('ContactDetail', {
                    type: 'block',
                    Name: contact.displayName,
                    Number: contact.number,
                  });
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons size={60} name="block" {...props} />
                    <Text style={{color: 'red', fontSize: 12}}>
                      {t('block')}
                    </Text>
                  </View>
                )}
              />
            </HStack>
          ) : (
            <IconButton
              color="red"
              onPress={async () => {
                nativeModules.unBlockPhone(contact.id);
              }}
              icon={props => (
                <View style={{alignItems: 'center'}}>
                  <Octions size={60} name="report" {...props} />
                  <Text style={{color: 'red', fontSize: 10}}>Unblock</Text>
                </View>
              )}
            />
          )}
          {data.tab === 2 && (
            <IconButton
              color="red"
              onPress={async () => {
                nativeModules.unBlockPhone(contact.id);
              }}
              icon={props => (
                <View style={{alignItems: 'center'}}>
                  <Octions size={60} name="report" {...props} />
                  <Text style={{color: 'red', fontSize: 10}}>Unblock</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
});

export default function ContactScreen({navigation}) {
  return <ListContact navigation={navigation} />;
}
