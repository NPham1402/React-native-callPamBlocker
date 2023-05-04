import {
  Animated,
  Button,
  FlatList,
  Image,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Slides from '../store/data';
import SlideItem from '../objects/SlideItem';
import Pagination from '../objects/Pagination';
import {HStack} from '@react-native-material/core';
import SelectLanguage from '../objects/SelectLanguage';
import {useTranslation} from 'react-i18next';
import {storage} from '../store/mmkv';

const TutoriralScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const {t} = useTranslation();
  const [viewTutorial, setView] = useState(0);

  const nativeModule = NativeModules.ControlPhone;

  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({viewableItems}) => {
    setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const {width, height} = useWindowDimensions();
  return (
    <View style={{width, height, backgroundColor: 'white'}}>
      {viewTutorial <= 2 ? (
        <View style={{width, height}}>
          <Image
            style={{width: width, height: height / 2}}
            source={require('../assets/logo.gif')}
          />
          {viewTutorial === 1 && (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'black',

                  paddingLeft: 15,

                  paddingBottom: 20,
                }}>
                {t('selectLanguage')}
              </Text>
              <SelectLanguage />
            </View>
          )}
          {viewTutorial === 2 && (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'red',
                  textAlign: 'center',

                  paddingLeft: 15,

                  paddingBottom: 20,
                }}>
                {t('requestPermission')}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'red',
                  textAlign: 'center',
                  paddingLeft: 15,

                  paddingBottom: 20,
                }}>
                {t('requestPermissionDecription')}
              </Text>
              <Button
                color={'red'}
                onPress={() => {
                  nativeModule.requestBlock();
                }}
                title={t('requestPermissionPress')}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setView(prev => prev + 1);
            }}
            style={{
              width: width - 30,
              height: 50,
              backgroundColor: 'cyan',
              marginLeft: 'auto',
              marginTop: 'auto',
              marginRight: 'auto',
              marginBottom: 40,
              borderWidth: 0.5,
              borderColor: 'cyan',
              borderRadius: 12,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: '#FFBE0B',
                marginLeft: 'auto',
                marginTop: 'auto',
                marginRight: 'auto',
                marginBottom: 'auto',
              }}>
              {viewTutorial === 0 && t('start')}
              {viewTutorial === 1 && t('continue')}
              {viewTutorial === 2 && t('introduction')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <FlatList
            data={Slides}
            renderItem={({item}) => <SlideItem item={item} />}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            onScroll={handleOnScroll}
            onViewableItemsChanged={handleOnViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          {index === 1 && (
            <TouchableOpacity
              onPress={() => {
                storage.set('tutorial', true);
                navigation.navigate('navigation');
              }}
              style={{
                width: 100,
                height: 30,
                backgroundColor: 'cyan',
                marginLeft: 'auto',
                marginTop: 'auto',
                marginRight: 20,
                marginBottom: 35,
                borderWidth: 0.5,
                borderColor: 'cyan',
                borderRadius: 12,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'black',
                  marginLeft: 'auto',
                  marginTop: 'auto',
                  marginRight: 'auto',
                  marginBottom: 'auto',
                }}>
                {t('start')}
              </Text>
            </TouchableOpacity>
          )}
          <Pagination data={Slides} scrollX={scrollX} index={index} />
        </View>
      )}
    </View>
  );
};

export default TutoriralScreen;

const styles = StyleSheet.create({});
