import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import NumberPhones from '../objects/NumberPhones';

export default function BlockListScreen() {
  useEffect(() => {
    let phone = NumberPhones();
    console.log;
  }, []);

  return (
    <View>
      <Text>BlockListScreen</Text>
    </View>
  );
}
