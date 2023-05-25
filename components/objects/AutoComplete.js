import axios from 'axios';
import React, {memo, useCallback, useRef, useState} from 'react';
import {Dimensions, Text, View, Platform, TouchableOpacity} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import NetInfo from "@react-native-community/netinfo";
import Feather from 'react-native-vector-icons/Feather';
import {AppContext} from '../store/darkModeContext';
import showPhoneItem from './ContentModal';
Feather.loadFont();

export const AutoComplete = memo(navigation => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);

  const searchRef = useRef(null);

  const getSuggestions = useCallback(async q => {
    NetInfo.fetch().then(state=>{
    if(state.isConnected===true){

      let filterToken = q.toLowerCase();
      if (filterToken === '') filterToken = '0';
      setSelectedItem(filterToken);
      setLoading(true);

      axios
        .get('http://10.0.2.2:8000/phone-numbers/' + filterToken + '/suggest/1', {
          headers: {authorization: 'spambl0ckerAuthorization2k1rbyp0wer'},
        })
        .then(data => {
          const items = data.data;
          const suggestions = items.result.map(item => ({
            id: item._id,
            title: item.phoneNumber,
          }));
          setSuggestionsList(suggestions);
          setLoading(false);
      });
    }
    else {
 setSuggestionsList(null);
    }
    })
  }, []);
  
  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => {}, []);

  const onSubmitSearch = text => {
    console.log(text + 'test');
  };

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
          ref={searchRef}
          controller={controller => {
            dropdownController.current = controller;
          }}
          // initialValue={'1'}
          
          direction={Platform.select({ios: 'down'})}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={item => {
              NetInfo.fetch().then(state=>{
    if(state.isConnected===true){

      item &&
      axios
                .get('http://10.0.2.2:8000/phone-numbers/detail/' + item.id, {
                  headers: {
                    authorization: 'spambl0ckerAuthorization2k1rbyp0wer',
                  },
                })
                .then(data => {
                  const {result} = data.data;
                  setModalHideShow();
                  setContents(showPhoneItem(result, navigation.navigation));
                });
          }})
          }}
          debounce={800}
          suggestionsListMaxHeight={Dimensions.get('window').height *0.25}
          onClear={onClearPress}
          onSubmit={e => onSubmitSearch(e.nativeEvent.text)}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          EmptyResultComponent={
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
            <Text style={{color: 'black', padding: 15, zIndex: -1}}>
              {item.title}
            </Text>
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
