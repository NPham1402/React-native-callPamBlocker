import {
  View,
  Text,
  NativeModules,
  useWindowDimensions,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
  SectionList,
} from 'react-native';

import uuid from 'react-native-uuid';
import React, {memo, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Divider,
  HStack,
  IconButton,
  ListItem,
  VStack,
} from '@react-native-material/core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octions from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from '../assets/StyleSheet';
import {useTranslation} from 'react-i18next';
import {getIdContact, startCall} from '../objects/MiniFuntions';
import {AppContext} from '../store/darkModeContext';
import {
  getContactsMatchingString,
  openContactForm,
  viewExistingContact,
} from 'react-native-contacts';

const CustomListItem = memo(data => {
  const [showMore, setShowMore] = useState(false);

  const history = data.history;
  const {t} = useTranslation();
  const typeCall = [
    t('incoming'),
    t('outgoing'),
    t('missed'),
    t('voicemail'),
    t('rejected'),
    t('blocked'),
    t('answered'),
  ];

  const conTactTemplate = {
    company: '',
    department: '',
    displayName: history.Name,
    emailAddresses: [],

    hasThumbnail: false,
    imAddresses: [],
    isStarred: false,
    jobTitle: '',
    middleName: '',
    note: '',
    number: '',
    phoneNumbers: [
      {
        label: 'mobile',
        number: history.Number,
      },
    ],
    postalAddresses: [],
    prefix: null,
    rawContactId: '',
    recordID: '',
    suffix: null,
    thumbnailPath: '',
    urlAddresses: [],
  };

  return (
    <View>
      <ListItem
        style={{
          marginTop: 20,
          borderWidth: 100,
          bottom: 120,
        }}
        onPress={() => {
          setShowMore(!showMore);
        }}
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
        title={
          <Text style={{fontSize: 20, fontWeight: 600, color: 'black'}}>
            {history.Name ? history.Name : history.Number}
          </Text>
        }
        secondaryText={
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 400,
                color: 'black',
              }}>
              {history.date} -{' '}
              <Text
                style={{
                  color:
                    Number(history.Type) - 1 === 2 ||
                    Number(history.Type) - 1 === 4 ||
                    Number(history.Type) - 1 === 5
                      ? 'red'
                      : 'green',
                  fontWeight: 700,
                }}>
                {typeCall[Number(history.Type) - 1]}
              </Text>
            </Text>
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
          {Number(history.Type) - 1 !== 5 && (
            <HStack style={{paddingTop: 4}}>
              <IconButton
                onPress={async () => {
                  history.Name
                    ? getContactsMatchingString(history.Name).then(data => {
                        viewExistingContact(data[0]);
                      })
                    : openContactForm(conTactTemplate);
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons name="contact-page" {...props} />
                    <Text style={{color: 'black', fontSize: 12}}>
                      {t(history.Name ? 'view' : 'add')}
                    </Text>
                  </View>
                )}
              />
              <IconButton
                color="green"
                onPress={() => {
                  startCall(history.Number);
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
                    'sms:' + history.Number + '?body=Enter your Message',
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
                onPress={async () => {}}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <MaterialIcons size={60} name="block" {...props} />
                    <Text style={{color: 'red', fontSize: 12}}>
                      {t('block')}
                    </Text>
                  </View>
                )}
              />

              <IconButton
                color="red"
                onPress={async () => {
                  data.navigation.navigate('ContactDetail', {
                    type: 'report',
                    ...history,
                  });
                }}
                icon={props => (
                  <View style={{alignItems: 'center'}}>
                    <Octions size={60} name="report" {...props} />
                    <Text style={{color: 'red', fontSize: 12}}>Report</Text>
                  </View>
                )}
              />
            </HStack>
          )}
          {Number(history.Type) - 1 === 5 && (
            <IconButton
              color="red"
              onPress={async () => {
                data.nativeModules.unBlockPhone(history.id);
                data.onRefresh;
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

export default function BlockListScreen({navigation}) {
  const nativeModules = NativeModules.ControlPhone;

  const {t} = useTranslation();

  const [History, setHistory] = useState(null);

  const {theme} = React.useContext(AppContext);

  function groupday(data) {
    const group = data.reduce((groups, product) => {
      const {Date} = product;
      const title = dayjs(Number(Date)).format('DD/MM/YYYY');

      if (!groups[title]) {
        groups[title] = [];
      }

      groups[title].push({
        ...product,
        date: dayjs(Number(Date)).format('HH:mm'),
      });
      return groups;
    }, {});

    return Object.keys(group).map(title => {
      return {
        title,
        data: group[title],
      };
    });
  }

  const takeACallHistory = async () => {
    setHistory(null);
    setHistory(
      groupday(JSON.parse(await nativeModules.getHistoryCall()).call.reverse()),
    );
  };

  const onRefresh = React.useCallback(() => {
    setHistory(null);
    setTimeout(() => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        ]).then(result => {
          if (result['android.permission.READ_CALL_LOG'] === 'granted') {
            takeACallHistory();
          }
        });
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      ]).then(result => {
        if (result['android.permission.READ_CALL_LOG'] === 'granted') {
          takeACallHistory();
        }
      });
    }
  }, []);

  const {height} = useWindowDimensions();

  return (
    <View
      style={{
        backgroundColor: theme === 'dark' ? '#3F3F3F' : '#f0f8ff',
        height,
      }}>
      <Text
        style={{
          fontSize: 30,
          color: theme === 'dark' ? '#C8C8C8' : 'black',
          fontWeight: 800,
          left: 20,
          right: 20,
        }}>
        {t('history')}
      </Text>
      <Button
        onPress={async () => {
          console.log('run');
          const a = await nativeModules.CheckSpamCOde('0946001321');
          console.log(a);
        }}
      />
      {History ? (
        <SectionList
          sections={History}
          initialScrollIndex={0}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
              }}>
              <CustomListItem
                history={item}
                navigation={navigation}
                nativeModules={nativeModules}
                onRefresh={onRefresh}
              />
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                alignItems: 'center',
                marginLeft: 20,
                marginRight: 20,
                padding: 'auto',
                borderRadius: 12,
                backgroundColor: 'gray',
              }}>
              <Text
                style={{
                  color: theme === 'dark' ? '#C8C8C8' : 'white',

                  fontSize: 20,
                  fontWeight: 900,
                }}>
                {title === dayjs().format('DD/MM/YYYY') ? 'Today' : title}
              </Text>
            </View>
          )}
        />
      ) : (
        <ActivityIndicator style={Style.container} size={'large'} />
      )}
    </View>
  );
}
