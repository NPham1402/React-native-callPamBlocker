import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  PermissionsAndroid,
  Button,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {HStack, IconButton, VStack} from '@react-native-material/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function BlockListScreen() {
  const nativeModules = NativeModules.ControlPhone;
  const [History, setHistory] = useState(null);
  const takeACallHistory = async () => {
    const HistoryCall = await nativeModules.getHistoryCall();
    console.log(HistoryCall);
  };
  const typeCall = [
    'incoming',
    'outgoing',
    'missed',
    'voicemail',
    'rejected',
    'blocked',
    ' answered',
  ];
  useEffect(() => {
    takeACallHistory();
  });
  return (
    <View style={{top: 50}}>
      <Text style={{fontSize: 30, fontWeight: 800, left: 20, right: 20}}>
        History
      </Text>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 12,
          marginTop: 20,
          padding: 16,
        }}>
        <HStack>
          <VStack fill>
            <Text style={{fontSize: 22, fontWeight: 800, color: 'black'}}>
              6505551212
            </Text>
            <HStack>
              <Text style={{fontSize: 15, fontWeight: 400, color: 'black'}}>
                {dayjs(1681552709287).format('DD/MM/YYYY')} - {typeCall[1]}
              </Text>
            </HStack>
          </VStack>
          <IconButton icon={props => <AntDesign name="phone" {...props} />} />
        </HStack>
      </View>
    </View>
  );
}
