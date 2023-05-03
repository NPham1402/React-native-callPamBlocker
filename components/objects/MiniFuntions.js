import {
  PermissionsAndroid,
  Platform,
  NativeModules,
  Linking,
} from 'react-native';
import {getContactById} from 'react-native-contacts';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function containsNumberObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].number === obj.number) {
      return true;
    }
  }

  return false;
}

const native = NativeModules.ControlPhone;
function startCall(Number) {
  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    ]).then(result => {
      if (result['android.permission.CALL_PHONE'] === 'granted')
        native.startCall(Number);
      if (result['android.permission.CALL_PHONE'] === 'never_ask_again')
        Linking.openSettings();
    });
  }
}

async function getIdContact(Number) {
  if (Platform.OS === 'android') {
    const id = await native.getContactRowIDLookupList(Number);
    return String(id);
  }
}

export {capitalizeFirstLetter, containsNumberObject, startCall, getIdContact};
