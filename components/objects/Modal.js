import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Style from '../assets/StyleSheet';
const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const setModalHideShow = () => setModalVisible(!modalVisible);
  const setDetailModalHideShow = status => setModalVisible(status);

  const [content, setContents] = useState(null);
  const {height, width} = useWindowDimensions();
  const Component = (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: height,
            width: width,
            zIndex: 0,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: height,
              width: width,
              zIndex: 0,
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}></TouchableOpacity>
          <View style={styles.centeredView}>
            <Pressable
              style={{position: 'absolute', top: 20, right: 20, zIndex: -1}}
              onPressOut={() => setModalHideShow(false)}>
              <FontAwesome5 name="times" size={32} color="black" />
            </Pressable>
            <ScrollView style={styles.modalView}>{content}</ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  return [Component, setModalHideShow, setContents, setDetailModalHideShow];
};

const styles = StyleSheet.create({
  centeredView: {
    height: '60%',

    marginTop: 'auto',
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    textAlign: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    zIndex: -1,
    elevation: 5,
  },
  modalView: {
    top: 50,

    zIndex: 100,
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
  },
});

export default useModal;
