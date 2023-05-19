import { useEffect } from 'react';
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/assets/lib/api';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/c08317629139023b0b66',
};

export default function App() {
    const router = useRouter()

  const [ hasLoadedFonts ] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })

  const [_, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'c08317629139023b0b66',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery,
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', { code })
    
    const { token } = response.data
    await SecureStore.setItemAsync('token', token);

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGithubOAuthCode(code)
    }
  }, [response]);

  if (!hasLoadedFonts) return null

  return (
    <View
      className="px-8 flex-1 items-center py-10"
    >
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo/>
        <View className="space-y-2">
          <Text
            className="text-center font-title text-2xl leading-tight text-gray-50"
          >
            Sua cápsula do tempo
          </Text>
          <Text
            className="text-center font-body text-base leading-relaxed text-gray-100"
          >
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
