import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  ListItem,
  TextInput,
} from '@react-native-material/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {temp} from '../../temp';
export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/getnumber")
  //     .then((value) => {
  //       console.log(value.data);
  //       setData(value.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }, []);
  console.log();
  return (
    <ScrollView>
      <View>
        <Box
          w={'100%'}
          h={300}
          m={0}
          style={{
            backgroundColor: 'cyan',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.53,
            shadowRadius: 13.97,

            elevation: 21,
          }}>
          <TextInput
            label="Search Your Number Phone"
            variant="outlined"
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 20,
              marginTop: 'auto',
              borderRadius: 12,
              borderColor: 'cyan',
            }}
            trailing={props => (
              <IconButton
                icon={props => (
                  <MaterialCommunityIcons name="magnify" {...props} />
                )}
                {...props}
              />
            )}
          />
        </Box>
        {/* <Button onPress={() => {}}>Test</Button> */}
        <Text>Top report</Text>
        {/* {temp.map((data) => {
          return (
            <View>
              <ListItem
                leadingMode="avatar"children={{}}
                leading={<Avatar label="Scamer
                " />}
                title={data.zone + " " + data.phone_number}
                secondaryText={data.provider}
              />
            </View>
          );
        })} */}
      </View>
    </ScrollView>
  );
}
