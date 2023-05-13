import {View, Text, ScrollView, Image, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
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
import {AppContext} from '../store/darkModeContext';
export default function HomeScreen({navigation}) {
  const [data, setData] = useState([]);
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('http://10.0.2.2:8000/phone-numbers/spammers/top-ten', {
        headers: {authorization: 'spambl0ckerAuthorization2k1rbyp0wer'},
      })
      .then(value => {
        setData(value.data.result);
        setLoading(false);
      })
      .catch(err => {
        throw err;
      });
  }, []);
  const {setModalHideShow, setContents} = React.useContext(AppContext);
  const {height} = useWindowDimensions();
  return (
    <View>
      <Box
        w={'100%'}
        h={(height * 40) / 100}
        m={0}
        style={{
          backgroundColor: 'cyan',
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
      <ScrollView>
        {data.map((value, index) => {
          return (
            <View
              key={index}
              style={{
                zIndex: 0,
                marginBottom: index === data.length - 1 ? 400 : 0,
              }}>
              <ListItem
                leadingMode="avatar"
                onPress={() => {
                  axios
                    .get(
                      'http://10.0.2.2:8000/phone-numbers/detail/' + value._id,
                      {
                        headers: {
                          authorization: 'spambl0ckerAuthorization2k1rbyp0wer',
                        },
                      },
                    )
                    .then(data => {
                      const {result} = data.data;
                      setModalHideShow();
                      setContents(showPhoneItem(result, navigation));
                    });
                }}
                leading={<Avatar label={String(index + 1)} />}
                title={
                  value.phoneNumber +
                  ' (' +
                  dayjs.unix(value.createAt).format('DD-MM-YYYY') +
                  ')'
                }
                secondaryText={value.status}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
