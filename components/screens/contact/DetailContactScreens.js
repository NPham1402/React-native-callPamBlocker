import {View, Text, LogBox, TouchableOpacity, Linking} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  ListItem,
  Spacer,
  TextInput,
  VStack,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Style from '../../assets/StyleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {itemEmailLabel, itemPhoneNumberLabel} from './LabelPicker';
import {
  capitalizeFirstLetter,
  containsNumberObject,
} from '../../objects/MiniFuntions';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
const useInput = props => {
  const [value, setValue] = useState('');
  const input = (
    <TextInput
      placeholder={props.label}
      variant="outlined"
      keyboardType={props.keyboardType}
      onChangeText={data => {
        setValue(data);
      }}
      leading={properties => (
        <MaterialIcons name={props.iconName} {...properties} />
      )}
    />
  );
  return [value, input];
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
const DetailContacts = ({navigation}) => {
  const route = useRoute();
  const [urlImg, setUrlImage] = useState(null);
  const [firstName, firstNameInput] = useInput({
    iconName: 'person',
    Icon,
    label: 'First Name',
    keyboardType: 'default',
  });
  const [lastName, lastNameInput] = useInput({
    iconName: 'person',
    Icon,
    label: 'Last Name',
    keyboardType: 'default',
  });

  const [number, numberInput] = useInput({
    iconName: 'phone-android',
    Icon,
    label: 'NumberPhone',
    keyboardType: 'number-pad',
  });
  const [email, emailInput] = useInput({
    iconName: 'email',
    Icon,
    label: 'Email',
    keyboardType: 'default',
  });

  const [labelPhoneNumber, labelPhoneNumberInput] = usePicker({
    item: itemPhoneNumberLabel,
  });
  const [labelEmail, labelEmailInput] = usePicker({item: itemEmailLabel});
  const [valuePhone, setValuePhone] = useState([]);
  const params = route.params;

  const renderHeader = section => {
    return (
      <View>
        <Text>{section.title}</Text>
      </View>
    );
  };

  const renderContent = section => {
    return (
      <View>
        <Text>{section.content}</Text>
      </View>
    );
  };

  useEffect(() => {
    console.log(valuePhone);
    // if (params.AddContact === true)
    //   navigation.setOptions({title: 'Add Contact'});
    // else navigation.setOptions({title: params.item.displayName});
  }, []);
  // useEffect(console.log(valueNumberPhone), [valueNumberPhone]);
  // sw
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            setUrlImage(image.path);
          });
        }}
        style={{
          marginBottom: 5,
          marginTop: 20,
          ...Style.center,
        }}>
        <Avatar
          autoColor
          // image={{
          //   uri: urlImg,
          // }}
          label={params.AddContact === false && params.item.displayName}
          icon={props => <AntDesign name="adduser" {...props} />}
          size={100}
        />
      </TouchableOpacity>
      {/* <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000000',
          ...Style.center,
        }}>
        hddhsgdshg
      </Text>
      <HStack m={4} spacing={50} style={{...Style.center}}>
        <IconButton
          onPress={() => {
            Linking.openURL(`tel:${'45665'}`);
          }}
          icon={props => (
            <View>
              <AntDesign name="phone" {...props} />
            </View>
          )}
        />
        <IconButton
          onPress={() => {
            Linking.openURL(`sms:${'658779-7'}?body=Enter Your Message`);
          }}
          icon={props => <MaterialIcons name="sms" {...props} />}
        />
        <IconButton icon={props => <MaterialIcons name="block" {...props} />} />
      </HStack> */}
      <View style={{paddingLeft: 20, paddingRight: 20}}>
        {firstNameInput}
        {lastNameInput}

        <HStack spacing={6}>
          <VStack fill>
            {numberInput}
            {labelPhoneNumberInput}
          </VStack>
          <View style={{borderLeftColor: '#0000000', borderLeftWidth: 0.25}}>
            <TouchableOpacity
              style={{
                ...Style.centerMarginVerticalDetailContact,
              }}>
              <IconButton
                color="white"
                backgroundColor="#00FFFF"
                marginLeft={6}
                onPress={() => {
                  const obj = {number, label: labelPhoneNumber};
                  if (number === '') {
                    showMessage({
                      message: 'Missing phoneNumber',
                      type: 'danger',
                    });
                  } else {
                    if (containsNumberObject(obj, valuePhone)) {
                      showMessage({
                        message: 'Dulicate phoneNumber',
                        type: 'danger',
                      });
                    } else {
                      setValuePhone(prev => [...prev, obj]);
                    }
                  }
                }}
                icon={props => <AntDesign name="plus" {...props} />}
              />
            </TouchableOpacity>
          </View>
        </HStack>
        <Accordion
          activeSections={[0]}
          sections={['Section 1', 'Section 2', 'Section 3']}
          renderHeader={renderHeader}
          renderContent={renderContent}
        />
        {valuePhone.length !== 0 && (
          <Collapsible collapsed={false}>
            {valuePhone.map((phone, index) => {
              return (
                <HStack key={index}>
                  <Text>
                    {phone.number} - {phone.label}
                  </Text>
                  <AntDesign
                    name="delete"
                    size={20}
                    onPress={() => {
                      const temp = [...valuePhone];
                      const removed = temp.splice(index, 1);
                      setValuePhone(temp);
                      console.log(temp, index);
                    }}
                  />
                </HStack>
              );
            })}
          </Collapsible>
        )}

        {emailInput}
        {labelEmailInput}
        <Button
          title="test"
          onPress={() => {
            var newPerson = {
              emailAddresses: [
                {
                  label: labelEmail,
                  email: email,
                },
              ],
              phoneNumbers: valuePhone,
              familyName: firstName,
              givenName: lastName,
            };
            console.log(newPerson);
            // Contacts.addContact(newPerson);
          }}
        />
      </View>
      {/* <HStack
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
      </HStack> */}
    </View>
  );
};
export default function DetailContactScreens() {
  return <DetailContacts />;
}
