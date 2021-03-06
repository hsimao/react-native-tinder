import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import generatedId from '../utils/generatedId';
import { db } from '../firebase';
import {
  doc,
  query,
  setDoc,
  getDoc,
  getDocs,
  where,
  onSnapshot,
  collection,
  serverTimestamp,
} from '@firebase/firestore';

const HomeScreen = () => {
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);

  // 檢查當前用戶自己是否已經儲存在 firestore 內, 若無將自動彈出 profile modal 頁面
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, 'users', user.uid), shapshot => {
        if (!shapshot.exists()) {
          navigation.navigate('Modal');
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'passes')
      ).then(snapshot => snapshot.docs.map(doc => doc.id));

      const swipes = await getDocs(
        collection(db, 'users', user.uid, 'swipes')
      ).then(snapshot => snapshot.docs.map(doc => doc.id));

      // NOTE: 空值給 ['test'], 是避免 firestore query where 傳入空值
      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      // 查出當前所有 user, 並排除跟自己和已經 passes、swipes 用戶
      unsub = onSnapshot(
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        ),
        snapshot => {
          setProfiles(
            snapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, []);

  const swipeLeft = cardIndex => {
    const userSwiped = profiles[cardIndex];
    if (!userSwiped) return;
    createPasses(user.uid, userSwiped);
  };

  const swipeRight = async cardIndex => {
    const userSwiped = profiles[cardIndex];
    if (!userSwiped) return;

    createSwiped(user.uid, userSwiped);

    // check if the user swiped on you
    const hasMatch = await checkUserSwipedWithSelf(userSwiped.id);

    if (hasMatch) {
      const selfProfile = await getProfileById(user.uid);
      await createMatch(selfProfile, userSwiped);

      navigation.navigate('Match', { selfProfile, userSwiped });
    }
  };

  const createSwiped = (selfId, swipedUser) => {
    setDoc(doc(db, 'users', selfId, 'swipes', swipedUser.id), swipedUser);
  };

  const createPasses = (selfId, swipedUser) => {
    setDoc(doc(db, 'users', selfId, 'passes', swipedUser.id), swipedUser);
  };

  const getProfileById = async userId => {
    return await (await getDoc(doc(db, 'users', userId))).data();
  };

  const checkUserSwipedWithSelf = swipedUserId => {
    return getDoc(doc(db, 'users', swipedUserId, 'swipes', user.uid))
      .then(docSnapshot => docSnapshot.exists())
      .catch(() => false);
  };

  const createMatch = (self, swiped) => {
    return setDoc(doc(db, 'matches', generatedId(self.uid, swiped.id)), {
      users: {
        [self.id]: self,
        [swiped.id]: swiped,
      },
      usersMatched: [self.id, swiped.id],
      timestamp: serverTimestamp(),
    });
  };

  const renderCard = item =>
    item ? (
      <View key={item.id} style={tw('relative bg-white h-3/4 rounded-xl')}>
        <Image
          style={tw('absolute top-0 h-full w-full rounded-xl')}
          source={{ uri: item.photoURL }}
        />

        <View
          style={[
            tw(
              'absolute bottom-0 flex-row justify-between bg-white w-full px-6 py-3 rounded-b-xl'
            ),
            styles.cardShadow,
          ]}
        >
          <View>
            <Text style={tw('text-xl font-bold')}>{item.displayName}</Text>
            <Text>{item.job}</Text>
          </View>
          <Text style={tw('text-2xl font-bold')}>{item.age}</Text>
        </View>
      </View>
    ) : (
      rednerEmptyCard()
    );

  const rednerEmptyCard = () => (
    <View
      style={[
        tw('relative bg-white h-3/4 rounded-xl justify-center items-center'),
        styles.cardShadow,
      ]}
    >
      <Text style={tw('font-bold pb-5')}>No more profiles</Text>
      <Image
        style={tw('h-20 w-full')}
        height={100}
        width={100}
        source={{ uri: 'https://links.papareact.com/6gb' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={tw('flex-1')}>
      {/* Header */}
      <View style={tw('flex-row items-center justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw('h-10 w-10 rounded-full')}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            style={tw('h-14 w-14')}
            source={require('../assets/logo.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#ff5864" />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Cards */}
      <View style={tw('flex-1')}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: 'transparent' }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={swipeLeft}
          onSwipedRight={swipeRight}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#4ded30',
                },
              },
            },
          }}
          renderCard={renderCard}
        />
      </View>

      {/* Bottom tool */}
      <View style={tw('flex-row justify-evenly')}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            'items-center justify-center rounded-full h-16 w-16 bg-red-200'
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            'items-center justify-center rounded-full h-16 w-16 bg-green-200'
          )}
        >
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
