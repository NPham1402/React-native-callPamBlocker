import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const useModal = ({content}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const setModalHideShow = () => setModalVisible(!modalVisible);

  const Component = (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        onBackdropPress={() => setModalHideShow(false)}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <Pressable
            style={{position: 'absolute', top: 20, right: 20}}
            onPressOut={() => setModalHideShow(false)}>
            <FontAwesome5 name="times" size={32} color="black" />
          </Pressable>
          {content}
        </View>
      </Modal>
    </View>
  );

  return [Component, setModalHideShow];
};

const styles = StyleSheet.create({
  centeredView: {
    height: '70%',
    marginTop: 'auto',
    backgroundColor: 'white',
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    width: '100%',
    height: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default useModal;
