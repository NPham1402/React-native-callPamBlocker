import axios from 'axios';
import React, {memo, useCallback, useRef, useState} from 'react';
import {Dimensions, Text, View, Platform, TouchableOpacity} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import {AppContext} from '../store/darkModeContext';
import showPhoneItem from './ContentModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {storage} from '../store/mmkv';
import {Chip, HStack, IconButton} from '@react-native-material/core';
Feather.loadFont();

export const AutoComplete = memo(navigation => {
  const [loading, setLoading] = useState(false);

  const [suggestionsList, setSuggestionsList] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);

  const dropdownController = useRef(null);

  const SearchRef = useRef(null);

  const getSuggestions = useCallback(async q => {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        let filterToken = q.toLowerCase();
        if (filterToken === '') filterToken = '0';
        setSelectedItem(filterToken);
        setLoading(true);

        axios
          .get(
            'https://api.call-spam-blocker.xyz/phone-numbers/' +
              filterToken +
              '/suggest/3',
            {
              headers: {authorization: 'spambl0ckerAuthorization2k1rbyp0wer'},
            },
          )
          .then(data => {
            const items = data.data;
            const suggestions = items.result.map((item, index) => ({
              id: item._id,
              title: item.phoneNumber,
              status: item.status,
              number: index,
            }));
            setSuggestionsList(suggestions);
            setLoading(false);
          });
      } else {
        setSuggestionsList(null);
      }
    });
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => {}, []);

  const onSubmitSearch = text => {};
  const {setModalHideShow, setContents} = React.useContext(AppContext);
  return (
    <>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            marginTop: 18,
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 5,
          },
          Platform.select({ios: {zIndex: 1}}),
        ]}>
        <AutocompleteDropdown
          ref={SearchRef}
          controller={controller => {
            dropdownController.current = controller;
          }}
          // initialValue={'1'}

          direction={Platform.select({ios: 'down'})}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={item => {
            NetInfo.fetch().then(state => {
              if (state.isConnected === true) {
                item &&
                  axios
                    .get(
                      'https://api.call-spam-blocker.xyz/phone-numbers/detail/' +
                        item.id,
                      {
                        headers: {
                          authorization: 'spambl0ckerAuthorization2k1rbyp0wer',
                        },
                      },
                    )
                    .then(data => {
                      const {result} = data.data;

                      setModalHideShow();
                      if (!storage.getString('Search')) {
                        storage.set(
                          'Search',
                          JSON.stringify({
                            number: [{id: item.id, number: item.title}],
                          }),
                        );
                      } else {
                        const phones = JSON.parse(storage.getString('Search'));
                        if (
                          phones.number.findIndex(
                            e => e.number === item.title,
                          ) === -1
                        ) {
                          storage.set(
                            'Search',
                            JSON.stringify({
                              number: [
                                ...phones.number,
                                {id: item.id, number: item.title},
                              ],
                            }),
                          );
                        }
                      }
                      setContents(showPhoneItem(result, navigation.navigation));
                    });
              }
            });
          }}
          debounce={800}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.25}
          onClear={onClearPress}
          onSubmit={e => onSubmitSearch(e.nativeEvent.text)}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          EmptyResultComponent={
            <View>
              <TouchableOpacity
                style={{
                  color: 'black',
                  textAlign: 'center',
                  padding: 15,
                  zIndex: -1,
                }}
                onPress={() => {
                  navigation.navigation.navigate('ContactDetail', {
                    type: 'report',
                    Name: '',
                    Number: selectedItem,
                  });
                }}>
                <Text>Enter to Report</Text>
              </TouchableOpacity>
            </View>
          }
          useFilter={false} // set false to prevent rerender twice
          textInputProps={{
            placeholder: 'Search ',
            autoCorrect: false,
            maxLength: 10,
            keyboardType: 'number-pad',
            autoCapitalize: 'none',
            style: {
              borderRadius: 12,
              backgroundColor: 'white',
              color: 'black',
              paddingLeft: 18,
            },
          }}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,

            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 12,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: 'white',
          }}
          containerStyle={{flexGrow: 1, flexShrink: 1}}
          renderItem={(item, text) => (
            <View>
              {item.number === 0 &&
                storage.getString('Search') &&
                JSON.parse(storage.getString('Search')).number.map(
                  (value, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        NetInfo.fetch().then(state => {
                          if (state.isConnected === true) {
                            value &&
                              axios
                                .get(
                                  'https://api.call-spam-blocker.xyz/phone-numbers/detail/' +
                                    value.id,
                                  {
                                    headers: {
                                      authorization:
                                        'spambl0ckerAuthorization2k1rbyp0wer',
                                    },
                                  },
                                )
                                .then(data => {
                                  const {result} = data.data;

                                  setModalHideShow();

                                  setContents(
                                    showPhoneItem(
                                      result,
                                      navigation.navigation,
                                    ),
                                  );
                                });
                          }
                        })
                      }
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 800,
                          padding: 15,
                          zIndex: -1,
                        }}>
                        {value.number}
                      </Text>
                      <IconButton
                        onPress={() => {
                          const phones = JSON.parse(
                            storage.getString('Search'),
                          );
                          phones.number.splice(phones.number.indexOf(value), 1);
                          storage.set(
                            'Search',
                            JSON.stringify({
                              number: [...phones.number],
                            }),
                          );
                          getSuggestions(text);
                        }}
                        size={4}
                        style={{margin: 1}}
                        icon={props => (
                          <Feather name="x-circle" size={18} color="black" />
                        )}
                      />
                    </TouchableOpacity>
                  ),
                )}
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 800,
                    padding: 15,
                    zIndex: -1,
                  }}>
                  {item.title}
                </Text>
                <Chip
                  variant="outlined"
                  color={
                    item.status === 'unknown'
                      ? 'secondary'
                      : item.status === 'spammer'
                      ? 'error'
                      : 'blue'
                  }
                  style={{marginBottom: 'auto', marginTop: 'auto'}}
                  label={item.status}
                />
              </View>
            </View>
          )}
          ChevronIconComponent={
            <Feather name="chevron-down" size={20} color="black" />
          }
          ClearIconComponent={
            <Feather name="x-circle" size={18} color="black" />
          }
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          //  showClear={false}
        />
      </View>
    </>
  );
});
