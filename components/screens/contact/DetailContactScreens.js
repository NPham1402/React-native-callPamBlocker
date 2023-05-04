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
const useInput = props => {
  const [value, setValue] = useState('');
  const input = (
    <TextInput
      style={{marginBottom: 20}}
      placeholder={props.label}
      variant="outlined"
      value={value}
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
  const [nameValue, nameInput, setName] = useInput({
    iconName: 'person',
    Icon,
    label: 'Name',
    multiline: false,
    keyboardType: 'default',
  });
  const [numberValue, numberInputs, setNumberInput] = useInput({
    iconName: 'person',
    Icon,
    label: 'Phone Number',
    multiline: true,
    keyboardType: 'number-pad',
  });

  const params = route.params;

  const nativeModule = NativeModules.ControlPhone;

  useEffect(() => {
    setName(params.Name);
    setNumberInput(params.Number);
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
          Add Block
        </Text>
        {nameInput}

        {numberInputs}

        <Button
          onPress={() => {
            if (nameValue !== '' && numberValue !== '') {
              nativeModule.addBlockPhone(uuid.v1(), nameValue, numberValue);
              navigation.navigate('Contact');
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
          title={params.type}
        />
      </View>
    </View>
  );
};
export default function DetailContactScreens() {
  return <DetailContacts />;
}
