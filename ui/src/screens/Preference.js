import React, {useEffect} from 'react';
import {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Button, Text} from 'react-native';
import Chip from '../components/Chip';
import Realm from 'realm';

const Preference = () => {
  const [options, setoptions] = useState([]);
  const preferenceSchema = {
    name: 'categories',
    properties: {
      name: 'string',
    },
    primaryKey: 'name',
  };
  const handleSelect = item => {
    const newOptions = options.filter(option => option !== item);
    console.log(newOptions);
    setoptions(newOptions);
  };

  const resetPref = () => {
    setoptions([
      'Business',
      'Entertainment',
      'India',
      'LifeStyle',
      'Politics',
      'ScienceAndTechnology',
      'Sports',
      'World',
    ]);
  };

  const savePref = async () => {
    const realm = await Realm.open({
      path: 'categories',
      schema: [preferenceSchema],
    });
    try {
      realm.write(() => {
        options.forEach(option => realm.create('categories', {name: option}));
      });
    } catch (error) {
      console.log(error);
    }

    realm.close();
  };

  const getOptions = async () => {
    const realm = await Realm.open({
      path: 'categories',
      schema: [preferenceSchema],
    });
    const savedOptions = realm.objects('categories');
    console.log(JSON.parse(savedOptions));
    // setoptions(JSON.parse(savedOptions[0].options));
  };

  useEffect(() => {
    getOptions();
  }, []);
  return (
    <View>
      <View style={styles.container}>
        {options.map(catg => {
          return (
            <TouchableOpacity
              onPress={() => {
                handleSelect(catg);
              }}>
              <Chip catg={catg} key={catg} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.button, {backgroundColor: 'red'}]}
          onPress={() => {
            resetPref();
          }}>
          <Text>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            savePref();
          }}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Preference;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-end',
    backgroundColor: 'green',
  },
});
