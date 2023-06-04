import {
  View,
  TouchableOpacity,
  Linking,
  Text,
  NativeModules,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Icon, TextInput} from '@react-native-material/core';
import Style from '../../assets/StyleSheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {itemEmailLabel, itemPhoneNumberLabel} from './LabelPicker';
import {
  capitalizeFirstLetter,
  containsNumberObject,
} from '../../objects/MiniFuntions';
import uuid from 'react-native-uuid';

import {showMessage} from 'react-native-flash-message';
import {AppContext} from '../../store/darkModeContext';
import axios from 'axios';
import {storage} from '../../store/mmkv';
const useInput = props => {
  const [value, setValue] = useState('');

  const input = (
    <TextInput
      style={{marginBottom: 20}}
      placeholder={props.label}
      variant="outlined"
      value={value}
      maxLength={props.max}
      multiline={props.multiline}
      keyboardType={props.keyboardType}
      onChangeText={data => {
        setValue(data);
      }}
      leading={properties => (
        <MaterialIcons name={props.iconName} {...properties} />
      )}
    />
  );
  return [value, input, setValue];
};
const usePicker = props => {
  const [valuePicker, setValuePicker] = useState('mobile');
  const picker = (
    <Picker
      selectedValue={valuePicker}
      onValueChange={value => {
        setValuePicker(value);
      }}>
      {props.item.map((values, index) => {
        return (
          <Picker.Item
            label={capitalizeFirstLetter(values)}
            value={values}
            key={index}
          />
        );
      })}
    </Picker>
  );
  return [valuePicker, picker];
};
const DetailContacts = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;
  const type = params ? params.type : 'report';

  const [nameValue, nameInput, setName] = useInput({
    iconName: 'person',
    Icon,
    label: 'Name',
    multiline: false,
    keyboardType: 'default',
  });

  const [contentValue, contentInput, setContent] = useInput({
    iconName: 'person',
    Icon,
    label: 'Description',
    multiline: true,

    keyboardType: 'default',
  });

  const {setDetailModalHideShow} = React.useContext(AppContext);

  const [numberValue, numberInputs, setNumberInput] = useInput({
    iconName: 'person',
    Icon,
    label: 'Phone Number',
    max: 10,
    keyboardType: 'number-pad',
  });

  const nativeModule = NativeModules.ControlPhone;

  useEffect(() => {
    if (route.name !== 'reportBlock') {
      if (type === 'report') {
        setDetailModalHideShow(false);
        setNumberInput(params.Number);
      } else {
        setName(params.Name);
        setNumberInput(params.Number);
      }
    }
  }, []);

  return (
    <View style={{marginBottom: 'auto', marginTop: 'auto'}}>
      <View style={{alignContent: 'center', paddingLeft: 20, paddingRight: 20}}>
        <Text
          style={{
            color: 'black',
            fontSize: 30,
            fontWeight: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 18,
          }}>
          {type === 'report' ? 'Report' : 'Block'}
        </Text>
        {nameInput}
        {type === 'report' && contentInput}
        {numberInputs}
        <Button
          onPress={() => {
            if (
              nameValue !== '' ||
              numberValue !== '' ||
              (type === 'report' && contentValue !== '')
            ) {
              if (type === 'block') {
                nativeModule.addBlockPhone(uuid.v1(), nameValue, numberValue);
                navigation.navigate('Contact');
              } else {
                axios({
                  method: 'post',
                  url:
                    'https://api.call-spam-blocker.xyz/phone-numbers/' +
                    numberValue +
                    '/reports',
                  headers: {
                    authorization: 'spambl0ckerAuthorization2k1rbyp0wer',
                  },
                  data: {
                    content: contentValue,
                    title: nameValue,
                    deviceId: storage.getString('id'),
                  },
                }).finally(() => {
                  nativeModule.addBlockPhone(uuid.v1(), nameValue, numberValue);
                  navigation.navigate('Contact');
                });
              }
            } else {
              showMessage({
                message: 'Please fill input',
                type: 'danger',
                floating: true,
                icon: 'danger',
                duration: 2000,
              });
            }
          }}
          style={{backgroundColor: 'cyan', color: 'black'}}
          title={type}
        />
      </View>
    </View>
  );
};
export default function DetailContactScreens() {
  return <DetailContacts />;
}
