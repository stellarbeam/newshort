import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import BookmarkItem from '../components/BookmarkItem';
import EmptyBookmark from '../components/EmptyBookmark';

//realm
import Realm from 'realm';

const Bookmarks = () => {
  const [data, setData] = useState([]);
  const renderItem = ({item}) => {
    return <BookmarkItem item={item} />;
  };

  const fetchBmarks = async () => {
    const realm = await Realm.open({
      path: 'bmark',
    });

    const bmarks = realm.objects('bmark');
    setData(bmarks);
  };

  useEffect(() => {
    fetchBmarks();
  }, []);
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyBookmark />}
        extraData={data}
      />
    </View>
  );
};

export default Bookmarks;
