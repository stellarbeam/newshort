import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SwipeCards from 'react-native-swipe-cards-deck';

import CardsEnd from '../components/CardsEnd';
import Card from '../components/Card';

const Home = () => {
  const [feed, setFeed] = useState([]);
  var feeds = [];
  const getFeed = async category => {
    try {
      const response = await fetch(
        `https://newshort.herokuapp.com/news?cat=${category}`,
      );
      const json = await response.json();
      feeds = [...feeds, ...json];
      console.log(feeds);
      shuffle();
    } catch (error) {
      console.error(error);
    }
  };

  const shuffle = () => {
    var array = feeds;
    var currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    console.log(array);
    setFeed(array);
  };

  useEffect(() => {
    getFeed('Business');
    getFeed('India');
    getFeed('Sports');
    getFeed('Politics');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYes = card => {
    console.log(`Yup for ${card.text}`);
    return true;
  };

  const handleNo = card => {
    console.log(`No for ${card.text}`);
    return true;
  };

  return (
    <View style={styles.container}>
      {feed.length !== 0 ? (
        <SwipeCards
          cards={feed}
          renderCard={cardData => <Card data={cardData} />}
          keyExtractor={cardData => String(cardData.text)}
          renderNoMoreCards={() => <CardsEnd text="No more Cards...." />}
          actions={{
            yup: {
              show: true,
              text: '👍',
              color: 'green',
              onAction: handleYes,
              containerStyle: styles.thumbsUp,
              textStyle: styles.emoji,
            },
            nope: {
              show: true,
              text: '👎',
              color: 'red',
              onAction: handleNo,
              containerStyle: styles.thumbDown,
              textStyle: styles.emoji,
            },
          }}
        />
      ) : (
        <CardsEnd text="Loading....." />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f3640',
  },
  thumbsUp: {
    position: 'absolute',
    left: 200,
    borderWidth: 0,
  },
  thumbDown: {
    position: 'absolute',
    right: 100,
    borderWidth: 0,
  },
  emoji: {
    fontSize: 100,
  },
});
