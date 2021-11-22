import React, { useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, setDoc } from '@firebase/firestore';

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Update your profile',
      headerStyle: {
        backgroundColor: '#ff5864',
      },
      headerTitleStyle: { color: 'white' },
    });
  });

  const updateUserProfile = async () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job,
      age,
      timestamp: serverTimestamp(), // NOTE: 避免用戶在別的國家, 會儲存到用戶國家的時區時間
    })
      .then(() => {
        navigation.navigate('Home');
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  return (
    <View style={tw('flex-1 items-center pt-1')}>
      <Image
        style={tw('h-20 w-full')}
        resizeMode="contain"
        source={{ uri: 'https://links.papareact.com/2pf' }}
      />
      <Text style={tw('text-xl text-gray-500 font-bold p-2')}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw('text-center text-red-400 font-bold p-4')}>
        Step 1: The Profile pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={tw('text-center text-xl pb-2')}
        placeholder="Enter a Profile Pic URL"
      />

      <Text style={tw('text-center text-red-400 font-bold p-4')}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={tw('text-center text-xl pb-2')}
        placeholder="Enter your occupation"
      />

      <Text style={tw('text-center text-red-400 font-bold p-4')}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={tw('text-center text-xl pb-2')}
        placeholder="Enter your age"
        keyboardType="number-pad"
        maxLength={2}
      />

      <TouchableOpacity
        disabled={incompleteForm}
        onPress={() => updateUserProfile()}
        style={[
          tw('w-64 p-3 rounded-xl absolute bottom-10'),
          incompleteForm ? tw('bg-gray-400') : tw('bg-red-400'),
        ]}
      >
        <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
