import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import tw from 'tailwind-rn';
import { db } from '../firebase';
import { query, where, onSnapshot, collection } from '@firebase/firestore';
import useAuth from '../hooks/useAuth';
import ChartRow from './ChartRow';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'matches'),
        where('usersMatched', 'array-contains', user.uid)
      ),
      snapshot =>
        setMatches(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );

    return unsub;
  }, []);

  return matches.length > 0 ? (
    <FlatList
      style={tw('h-full')}
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ChartRow matchDetails={item} />}
    />
  ) : (
    <View style={tw('p-5')}>
      <Text style={tw('text-center text-lg')}>No matches at the moment 😢</Text>
    </View>
  );
};

export default ChatList;
