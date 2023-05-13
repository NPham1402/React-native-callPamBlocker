import {View, Text} from 'react-native';
import React from 'react';
import {Chip, HStack, IconButton} from '@react-native-material/core';
import dayjs from 'dayjs';
import Octions from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../store/darkModeContext';
export default function showPhoneItem(data, navigation) {
  const {name, phoneNumber, reportList, status, region} = data;
  return (
    <View>
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
              color: 'red',
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
                label={region.regionName}
                style={{position: 'relative'}}
              />
            </View>
            <Text style={{fontSize: 20, fontWeight: 800, color: 'red'}}>
              {'  '}
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
              color: 'red',
            }}>
            {region.regionCode}
          </Text>
        </HStack>
        <HStack style={{marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 400, color: 'black'}}>
            Status:
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '40%',
              fontSize: 20,
              fontWeight: 800,
              color: 'red',
            }}>
            {status}
          </Text>
        </HStack>
      </View>
      {reportList && (
        <View>
          <Text
            style={{left: 20, fontSize: 20, fontWeight: 400, color: 'black'}}>
            Report
          </Text>
          {reportList.map((data, index) => {
            return (
              <View
                key={index}
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: index === reportList.length - 1 ? 60 : 6,
                  borderRadius: 12,
                  backgroundColor: '#7CFC00',
                }}>
                <Text
                  style={{
                    marginTop: 5,
                    marginLeft: 15,
                    fontSize: 18,
                    fontWeight: 800,
                    color: 'black',
                  }}>
                  {data.title} ({dayjs(data.reportDate).format('DD-MM-YYYY')})
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    marginLeft: 15,
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'black',
                  }}>
                  Content: {data.content}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
