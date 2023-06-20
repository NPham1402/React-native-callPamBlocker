import {View, Text, Linking} from 'react-native';
import React from 'react';
import {
  Button,
  Chip,
  Divider,
  HStack,
  IconButton,
} from '@react-native-material/core';
import dayjs from 'dayjs';
import Octions from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../store/darkModeContext';
export default function showPhoneItem(data, navigation) {
  const {name, phoneNumber, reportList, _id, status, region} = data;

  return (
    <View style={{paddingBottom: 15}}>
      <View style={{left: 20}}>
        <Text
          style={{
            left: '35%',
            fontSize: 40,
            fontWeight: 600,
            color: 'black',
          }}>
          Detail
        </Text>
        <IconButton
          style={{left: '40%'}}
          color="red"
          onPress={() => {
            navigation.navigate('ContactDetail', {
              type: 'report',
              ...data,
              Number: data.phoneNumber,
            });
          }}
          icon={props => (
            <View style={{alignItems: 'center'}}>
              <Octions size={60} name="report" {...props} />
              <Text style={{color: 'red', fontSize: 12}}>Report</Text>
            </View>
          )}
        />

        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: 'black',
            }}>
            Provider:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
              margin: 'auto',
              fontSize: 20,
              fontWeight: 800,
              color: 'black',
            }}>
            {name}
          </Text>
        </View>

        <HStack style={{marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 400, color: 'black'}}>
            Phone:
          </Text>

          <HStack
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
            }}>
            <View>
              <Chip
                color="blue"
                label={region.regionCode}
                style={{position: 'relative'}}
              />
            </View>
            <Text> {'  '}</Text>
            <Text
              style={{
                textDecorationLine: 'underline',
                fontSize: 20,
                fontWeight: 800,
                color: '#221f49',
              }}>
              {String(phoneNumber).substring(1)}
            </Text>
          </HStack>
        </HStack>

        <HStack style={{marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 400, color: 'black'}}>
            Region:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
              fontSize: 20,
              fontWeight: 800,
              color: 'black',
            }}>
            Viet Nam
          </Text>
        </HStack>
        <HStack style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 20,
              textTransform: 'capitalize',
              fontWeight: 400,
              color:
                status === 'unknown'
                  ? 'black'
                  : status === 'spammer'
                  ? 'red'
                  : 'blue',
            }}>
            Status:
          </Text>
          <Chip
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
              fontSize: 20,
              fontWeight: 800,
            }}
            label={status}
            color={
              status === 'unknown'
                ? 'secondary'
                : status === 'spammer'
                ? 'error'
                : 'blue'
            }
          />
        </HStack>
        <HStack style={{marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 400, color: 'black'}}>
            Report:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
              fontSize: 20,
              fontWeight: 800,
              color: 'black',
            }}>
            {reportList.length} report
          </Text>
        </HStack>
      </View>

      <Button
        title="Show more"
        color="error"
        onPress={() => {
          Linking.openURL(
            'https://www.callspamblocker.online/detail?id=' + _id,
          );
        }}
        style={{marginLeft: 20, marginRight: 20, marginTop: 20}}
      />
    </View>
  );
}
