import {Text, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {HStack} from '@react-native-material/core';

import {storage} from '../store/mmkv';
import {useTranslation} from 'react-i18next';
export default function SelectLanguage() {
  const [tab, setTab] = useState(1);
  const {t, i18n} = useTranslation();
  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => {
        storage.set('language', value);
      })
      .catch(err => console.log(err));
  };
  const choseLanguage = () => {
    if (storage.getString('language') === 'vi') {
      setTab(1);
    } else {
      setTab(2);
    }
  };
  useLayoutEffect(() => {
    choseLanguage();
  }, []);
  useLayoutEffect(() => {
    if (tab === 1) {
      changeLanguage('vi');
    } else {
      changeLanguage('en');
    }
  }, [tab]);
  return (
    <HStack
      style={{
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
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
          🇻🇳 Tiếng việt
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
          🇺🇸 English
        </Text>
      </TouchableOpacity>
    </HStack>
  );
}
