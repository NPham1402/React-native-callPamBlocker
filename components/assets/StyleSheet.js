import {StyleSheet} from 'react-native';

const Style = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centerPaddingVertical: {
    paddingTop: 'auto',
    paddingBottom: 'auto',
  },
  centerMarginVerticalDetailContact: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default Style;
