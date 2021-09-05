import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const CardsEnd = ({text}) => {
  return (
    <View>
      <Text style={styles.textColor}>{text}</Text>
    </View>
  );
};

export default CardsEnd;

const styles = StyleSheet.create({
  textColor: {
    color: 'white',
    fontSize: 20,
  },
});
