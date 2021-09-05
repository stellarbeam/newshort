import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookmarkItem = ({item}) => {
  console.log(item);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.cardsText}>{item.title}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          Linking.openURL(item.url);
        }}>
        <Icon name="newspaper-o" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default BookmarkItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 5,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
  },
  bold: {
    fontWeight: 'bold',
  },
  cardsText: {
    fontSize: 17,
    color: '#1a1a1a',
    marginBottom: 10,
    fontFamily: 'Roboto Condensed',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  textContainer: {
    flex: 2,
  },
});
