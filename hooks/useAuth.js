import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { androidClientId, iosClientId } from '@env';

const AuthContext = createContext({});

const config = {
  androidClientId: androidClientId,
  iosClientId: iosClientId,
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location'],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [lodingInitial, setLodingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // 監聽用戶登入狀態, 須注意要處理到解除訂閱, 這邊直接用 () => 返回清除
  // 或可儲存 const unsub = onAuthStateChanged(), 在 return unsub()
  useEffect(
    () =>
      onAuthStateChanged(auth, user => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }

        setLodingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch(error => setError(error))
      .finally(() => setLoading(true));
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config)
      .then(async loginResult => {
        if (loginResult.type === 'success') {
          const { idToken, accessToken } = loginResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
      }}
    >
      {!lodingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
