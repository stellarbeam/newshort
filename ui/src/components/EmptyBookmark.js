import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const EmptyBookmark = () => {
  return (
    <View style={styles.container}>
      <Text>Nothing Bookmarked</Text>
    </View>
  );
};

export default EmptyBookmark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
