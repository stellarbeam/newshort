import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const Chip = ({catg}) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{catg}</Text>
      <Icon name="circle-with-cross" size={30} />
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipText: {
    fontSize: 25,
  },
});
