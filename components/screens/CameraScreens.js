// 'use strict';
// import React, {Component} from 'react';

// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   TouchableOpacity,
//   Linking,
//   NativeModules,
// } from 'react-native';

// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
// import {Button, HStack, Icon, IconButton} from '@react-native-material/core';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import useModal, {setModalVisible} from '../objects/Modal';

// export default function ScanScreen({navigation}) {
//   const onSuccess = e => {
//     console.log(e.data);
//     // Linking.openURL(e.data).catch(err =>
//     //   console.error('An error occured', err),
//     // );
//   };
//   const nativeModules = NativeModules.ControlPhone;
//   const [Modal, open] = useModal();

//   return (
//     <QRCodeScanner
//       onRead={onSuccess}
//       bottomContent={
//         <HStack spacing={24} style={{position: 'absolute', bottom: 30}}>
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('qrcode');
//             }}>
//             <FontAwesome5 name="qrcode" size={32} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('qrcode');
//             }}>
//             <FontAwesome name="flash" size={32} color="black" />
//           </TouchableOpacity>
//         </HStack>
//       }
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centerText: {
//     flex: 1,
//     fontSize: 18,
//     padding: 32,
//     color: '#777',
//     height: 100,
//   },
//   textBold: {
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonText: {
//     fontSize: 21,
//     color: 'rgb(0,122,255)',
//   },
//   buttonTouchable: {
//     padding: 16,
//   },
// });
