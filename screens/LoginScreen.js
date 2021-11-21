import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={tw('flex-1')}>
      <ImageBackground
        resize="cover"
        style={tw('flex-1')}
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'),
            { marginHorizontal: '25%' },
          ]}
        >
          <Text style={tw('text-center font-semibold')}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
