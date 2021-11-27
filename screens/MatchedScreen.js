import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'tailwind-rn';

const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const { selfProfile, userSwiped } = params;
  // NOTE: 測試用資料
  // const selfProfile = {
  //   age: 30,
  //   displayName: 'Mars',
  //   id: '1234',
  //   job: 'Front-End Developer',
  //   photoURL:
  //     'https://camo.githubusercontent.com/f96fe25b150c6d62d6ff99b9f21006595c8cd757a24ebddf9d158297337cf6d1/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f31334867774773584630616947592f67697068792e676966',
  // };

  // const userSwiped = {
  //   age: 20,
  //   displayName: 'Sarah Black',
  //   id: '123456',
  //   job: 'Actor',
  //   photoURL: 'https://cdn2.ettoday.net/images/5982/d5982328.jpg',
  // };

  return (
    <View style={[tw('h-full bg-red-500 pt-20'), { opacity: 0.89 }]}>
      <View style={tw('justify-center px-10 pt-20')}>
        <Image
          style={tw('h-20 w-full rounded-full')}
          source={{ uri: 'https://links.papareact.com/mg9' }}
        ></Image>
      </View>

      <Text style={tw('text-white text-center mt-5')}>
        You and {userSwiped.displayName} have liked each other.
      </Text>

      <View style={tw('flex-row justify-evenly mt-5')}>
        <Image
          style={tw('h-32 w-32 rounded-full')}
          source={{ uri: selfProfile.photoURL }}
        />
        <Image
          style={tw('h-32 w-32 rounded-full')}
          source={{ uri: userSwiped.photoURL }}
        />
      </View>

      <TouchableOpacity
        style={tw('bg-white m-5 px-10 py-8 rounded-full mt-20')}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}
      >
        <Text style={tw('text-center')}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;
