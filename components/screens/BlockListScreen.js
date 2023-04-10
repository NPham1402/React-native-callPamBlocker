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
import NumberPhones from '../objects/NumberPhones';
import {HStack} from '@react-native-material/core';
import Style from '../assets/StyleSheet';

const NumberPad = ({onInput, number}) => {
  // The numbers to display on the pad
  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['*', 0, '#'],
    ['', '📞', '⌫'],
  ];
  const nativeModules = NativeModules.ControlPhone;

  // A function to handle the press of a number button
  const handlePress = value => {
    // If the value is "del", call the onInput function with null
    if (value === '⌫') {
      onInput(null);
    } else {
      if (value !== '' && value != '📞') {
        onInput(value);
      }
      if (value === '📞') {
        nativeModules.startCall(number);
      }
    }
  };

  // Return the JSX for the number pad
  return (
    <View style={styles.container}>
      {numbers.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map(number => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => handlePress(number)}
              disabled={number === ''}>
              <Text style={styles.text}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

// The styles for the number pad
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default function BlockListScreen() {
  // useEffect(() => {
  //   let phone = NumberPhones();
  //   console.log;
  // }, []);

  const [value, setValue] = useState('');

  // A function to handle the input from the number pad
  const handleInput = number => {
    // If the number is null, delete the last character of the value
    if (number === null) {
      setValue(value.slice(0, -1));
    } else {
      // Otherwise, append the number to the value
      setValue(value + number);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#eee',
    },
    input: {
      width: '80%',
      height: 80,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      padding: 10,
      fontSize: 40,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  const click = async () => {
    requestCameraPermission();
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        editable={false}
        placeholder="Enter a number"
      />
      <NumberPad onInput={handleInput} number={value} />
    </View>
  );
}
