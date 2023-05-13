import useModal from '../objects/Modal';
import {storage} from './mmkv';
import React, {useLayoutEffect} from 'react';
const AppContext = React.createContext();

const AppContextProvider = ({children}) => {
  const [theme, setTheme] = React.useState('light');

  const [Modal, setModalHideShow, setContents, setDetailModalHideShow] =
    useModal();

  const handleTheme = () => {
    if (storage.getString('theme') === undefined) {
      storage.set('theme', 'light');
    } else {
      setTheme(storage.getString('theme'));
    }
  };
  useLayoutEffect(() => {
    handleTheme();
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
