import {View, Text, ScrollView, Image, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  HStack,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {AutoComplete, RemoteDataSetExample2} from '../objects/AutoComplete';
import dayjs from 'dayjs';
import showPhoneItem from '../objects/ContentModal';
import NetInfo from '@react-native-community/netinfo';
import {AppContext} from '../store/darkModeContext';
import {Picker} from '@react-native-picker/picker';
export default function HomeScreen({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const makeStyle = status => {
    if (status === 'unknown') {
      return {
        backgroundColor: 'rgb(145 254 159 / 47%)',
        color: 'green',
      };
    } else if (status === 'spammer') {
      return {
        backgroundColor: '#ffadad8f',

        borderRadius: 12,
        color: 'red',
      };
    } else {
      return {
        backgroundColor: '#59bfff',
        color: 'white',
      };
    }
  };

  const [selectedPicker, setSelectedPicker] = useState('top');

  useEffect(() => {
    setData(null);
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        axios
          .get(
            selectedPicker === 'top'
              ? 'https://api.call-spam-blocker.xyz/phone-numbers/spammers/top-ten/top-reports'
              : 'https://api.call-spam-blocker.xyz/phone-numbers/spammers/top-ten/recent-reports',
            {
              headers: {authorization: 'spambl0ckerAuthorization2k1rbyp0wer'},
            },
          )
          .then(value => {
            setData(value.data.result);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    });
  }, [selectedPicker]);
  const {setModalHideShow, setContents, theme} = React.useContext(AppContext);

  const {height} = useWindowDimensions();

  const {t} = useTranslation();

  return (
    <View
      style={{
        backgroundColor: theme === 'dark' ? '#3F3F3F' : '#f0f8ff',
        height,
      }}>
      <View
        style={{
          height: height - 110,
        }}>
        <Box
          w={'100%'}
          h={(height * 40) / 100}
          m={0}
          style={{
            backgroundColor: theme === 'dark' ? '#008b8b' : 'cyan',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.53,
            shadowRadius: 13.97,

            elevation: 21,
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{width: '100%', height: '100%', position: 'absolute'}}
          />
          <AutoComplete navigation={navigation} />
        </Box>
        <Picker
          selectedValue={selectedPicker}
          onValueChange={itemValue => setSelectedPicker(itemValue)}>
          <Picker.Item label={t('pickerTopReport')} value="top" />
          <Picker.Item label={t('pickerTopRecentReport')} value="recent" />
        </Picker>
        <ScrollView>
          <View style={{padding: 6}}>
            {data &&
              data.map((value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      zIndex: 0,
                    }}>
                    <ListItem
                      leadingMode="avatar"
                      onPress={() => {
                        NetInfo.fetch().then(state => {
                          if (state.isConnected === true) {
                            axios
                              .get(
                                'https://api.call-spam-blocker.xyz/phone-numbers/detail/' +
                                  value._id,
                                {
                                  headers: {
                                    authorization:
                                      'spambl0ckerAuthorization2k1rbyp0wer',
                                  },
                                },
                              )
                              .then(data => {
                                const {result} = data.data;
                                setModalHideShow();
                                setContents(showPhoneItem(result, navigation));
                              });
                          }
                        });
                      }}
                      leading={<Avatar label={String(index)} />}
                      title={
                        <Text style={{fontWeight: 800}}>
                          {value.phoneNumber +
                            ' (' +
                            dayjs(value.createAt).format('DD-MM-YYYY') +
                            ')'}
                        </Text>
                      }
                      secondaryText={
                        <Chip label={value.status} color="error">
                          {}
                        </Chip>
                      }
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
