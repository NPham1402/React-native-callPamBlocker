import {NativeModules} from 'react-native';
import useModal from '../objects/Modal';
import {storage} from './mmkv';
import React, {useLayoutEffect} from 'react';
const AppContext = React.createContext();

const template = ['notification', 'create', 'block', 'slient', 'addBlock'];

const AppContextProvider = ({children}) => {
  const [theme, setTheme] = React.useState('light');

  const [Modal, setModalHideShow, setContents, setDetailModalHideShow] =
    useModal();

  const nativeModules = NativeModules.ControlPhone;
  const handleCall = async () => {
    const dataSetting = await nativeModules.getAllSetting();
    template.map(value => storage.set(value, JSON.parse(dataSetting)[value]));
  };
  const handleTheme = () => {
    if (storage.getString('theme') === undefined) {
      storage.set('theme', 'light');
      const phone = {
        numbers: ['093822418'],
      };
      storage.set('find', JSON.stringify(phone));
    } else {
      setTheme(storage.getString('theme'));
    }
  };
  useLayoutEffect(() => {
    handleTheme();
    handleCall();
  }, []);
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        setModalHideShow,
        setContents,
        setDetailModalHideShow,
      }}>
      {Modal}
      {children}
    </AppContext.Provider>
  );
};
export {AppContext, AppContextProvider};
