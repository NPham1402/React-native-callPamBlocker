import {View, Text, NativeModules, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {Button} from '@react-native-material/core';
import QRCode from 'react-native-qrcode-svg';
export default function AddBlockScreens({navigation}) {
  const nativeModules = NativeModules.ControlPhone;
  const requestReadSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Read Phone State');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestReadSMSPermission();
  }, []);
  const onSubmit = async () => {
    try {
      const Imei = await nativeModules.getANumberPhone();
      console.log(`Created a new event with id ${Imei}`);
    } catch (e) {
      console.error(e);
    }
  };
  const contact = {
    cc: 'db',
  };
  return (
    <View>
      <QRCode value="http://awesome.link.qr" />
    </View>
  );
}
