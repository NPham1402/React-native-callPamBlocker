import {View, Text, LogBox, TouchableOpacity, Linking} from 'react-native';
import Contacts from 'react-native-contacts';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  HStack,
  Icon,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Style from '../../assets/StyleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';

const DetailContacts = ({navigation}) => {
  const route = useRoute();
  const [urlImg, setUrlImage] = useState(null);
  const [valueName, setValueName] = useState([]);
  const params = route.params;
  useEffect(() => {
    LogBox.ignoreLogs([
      'ReactImageView: Image source "null" doesn&apos;t exist',
    ]);
    // if (params.AddContact === true)
    //   navigation.setOptions({title: 'Add Contact'});
    // else navigation.setOptions({title: params.item.displayName});
  }, []);
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
          image={{
            uri: urlImg,
          }}
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
        <TextInput
          label="First Name"
          onChangeText={data => {
            setValueName(prev => (
              {
                firstName: data,
                ...prev,
              },
            ));
          }}
          leading={props => <MaterialIcons name="person" {...props} />}
        />
        <TextInput
          label="Last Name"
          onChangeText={data =>
            setValueName(prev => 
              ({
                lastName: data,
                ...prev,
              },
            ));
          }
          leading={props => <MaterialIcons name="person" {...props} />}
        />
        <TextInput
          label="Number Phone"
          leading={props => <MaterialIcons name="label" {...props} />}
        />
        <Picker
          style={{borderColor: '#000000', borderWidth: 2, ...Style.shadow}}>
          <Picker.Item label="Mobile" value="mobile" />
          <Picker.Item label="Home" value="home" />
          <Picker.Item label="Work" value="work" />
          <Picker.Item label="Work Fax" value="work fax" />
          <Picker.Item label="Pager" value="Pager" />
          <Picker.Item label="Other" value="other" />
          <Picker.Item label="Custom" value="custom" />
          <Picker.Item label="CallBack" value="callback" />
          <Picker.Item label="Car" value="car" />
          <Picker.Item label="Work Mobile" value="work mobile" />
          <Picker.Item label="Assistant" value="assistant" />
          <Picker.Item label="MMS" value="mms" />
        </Picker>
        <TextInput
          label="Email (Option)"
          leading={props => <MaterialIcons name="label" {...props} />}
        />
        <Picker
          style={{borderColor: '#000000', borderWidth: 2, ...Style.shadow}}>
          <Picker.Item label="Mobile" value="mobile" />
          <Picker.Item label="Home" value="home" />
          <Picker.Item label="Work" value="work" />
          <Picker.Item label="Other" value="other" />
          <Picker.Item label="Custom" value="custom" />
        </Picker>
        <Button
          title="test"
          onPress={() => {
            var newPerson = {
              emailAddresses: [
                {
                  label: 'work',
                  email: 'mrniet@example.com',
                },
              ],
              phoneNumbers: [
                {
                  label: 'work',
                  number: '876777968',
                },
              ],
              familyName: 'Nietzkjhbsche',
              givenName: 'Friekjhguidrich',
            };

            Contacts.addContact(newPerson);
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
