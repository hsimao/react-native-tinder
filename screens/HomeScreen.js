import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';

const FAKE_USER_DATA = [
  {
    id: 124,
    firstName: 'Elon',
    lastName: 'Musk',
    job: 'Software Developer',
    photoURL:
      'https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg',
    age: 40,
  },
  {
    id: 123,
    firstName: 'Mars',
    lastName: 'CHEN',
    job: 'Software Developer',
    photoURL:
      'https://lh3.googleusercontent.com/ogw/ADea4I5pFdEo3tcn87r64a0g9LdZc931xD3myZMiaaSvGQ=s192-c-mo',
    age: 27,
  },
  {
    id: 125,
    firstName: 'Jack',
    lastName: 'CHEN',
    job: 'Software Developer',
    photoURL:
      'https://gravatar.com/avatar/ed1b7d08248dd08eeac3cfba428b8545?s=400&d=robohash&r=x',
    age: 21,
  },
];

const HomeScreen = () => {
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const renderCard = item => (
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
          <Text style={tw('text-xl font-bold')}>
            {item.firstName} {item.lastName}
          </Text>
          <Text>{item.job}</Text>
        </View>
        <Text style={tw('text-2xl font-bold')}>{item.age}</Text>
      </View>
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

        <TouchableOpacity>
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
          cards={FAKE_USER_DATA}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={() => {
            console.log('Swipe PASS');
          }}
          onSwipedRight={() => {
            console.log('Swipe MATCH');
          }}
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
