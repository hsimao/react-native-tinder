import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';
import {
  addDoc,
  query,
  orderBy,
  onSnapshot,
  collection,
} from '@firebase/firestore';
import getMatchedUserInfo from '../utils/getMatchedUserInfo';

const ChartRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
    );

    return unsub;
  }, [matchDetails, db]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Message', { matchDetails })}
      style={[
        tw('flex-row items-center py-3 px-5 mx-3 my-1 rounded-lg bg-white'),
        styles.cardShadow,
      ]}
    >
      <Image
        style={tw('rounded-full h-16 w-16 mr-4')}
        source={{ uri: matchedUserInfo?.photoURL }}
      />

      <View>
        <Text style={tw('text-lg font-semibold')}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChartRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
