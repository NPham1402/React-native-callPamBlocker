import {View, Text} from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import useModal from '../objects/Modal';
import {Button} from '@react-native-material/core';

export default function QrScreen() {
  const [Modal, open] = useModal();
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <QRCode size={250} value="http://awesome.link.qr" />
      {Modal}
      <Button onPress={open} />
    </View>
  );
}
