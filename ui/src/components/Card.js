/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

//realm
import Realm from 'realm';

const Card = ({data}) => {
  const bmarkSchema = {
    name: 'bmark',
    properties: {
      title: 'string',
      date: 'string',
      content: 'string',
      url: 'string',
    },
    primaryKey: 'date',
  };

  const handleBookmark = async () => {
    const realm = await Realm.open({
      path: 'bmark',
      schema: [bmarkSchema],
    });
    let task;

    realm.write(() => {
      // eslint-disable-next-line no-unused-vars
      task = realm.create('bmark', {
        title: data.title,
        date: data.date,
        content: data.content,
        url: data.url,
      });
    });
  };
  return (
    <View style={styles.card}>
      <View style={styles.headline}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text>{data.category}</Text>
          </View>
          <View style={styles.chip}>
            <Text>{moment(data.date).format('MMM Do YYYY')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{data.content}</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.eContainer}>
          <AntIcon name="dislike2" size={40} color="red" />
        </View>
        <View
          style={[
            styles.eContainer,
            {borderLeftWidth: 1, borderRightWidth: 1},
          ]}>
          <TouchableOpacity
            onPress={() => {
              handleBookmark();
            }}>
            <Icon name="bookmark" size={40} />
          </TouchableOpacity>
        </View>

        <View style={styles.eContainer}>
          <AntIcon name="like2" size={40} color="green" />
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 350,
    height: 650,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#FAFAFA',
    borderColor: 'orange',
  },
  title: {
    fontSize: 17,
    color: '#1a1a1a',
    marginBottom: 10,
    fontFamily: 'Roboto Condensed',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  chips: {
    flexDirection: 'row',
  },

  chip: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 30,
    backgroundColor: '#5EBA7D',
    marginHorizontal: 4,
  },

  headline: {
    padding: 10,
    backgroundColor: '#FAF9F6',
    marginTop: 15,
  },
  contentContainer: {
    backgroundColor: 'orange',
    padding: 10,
    flex: 2,
    overflow: 'hidden',
  },
  contentText: {
    fontSize: 15,
    fontFamily: 'Roboto Condensed',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    width: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    marginTop: 'auto',
  },
  eContainer: {
    height: 60,
    borderTopWidth: 2,
    width: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  button: {
    fontSize: 20,
  },
});
