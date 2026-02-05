import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      let errorMessage = 'Algo deu errado';
      if (error.code === 'auth/invalid-email') errorMessage = 'Endereço de e-mail inválido';
      if (error.code === 'auth/user-not-found') errorMessage = 'Usuário não encontrado';
      if (error.code === 'auth/wrong-password') errorMessage = 'Senha incorreta';
      Alert.alert('Falha no login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === '12501') {
        // User cancelled the sign-in flow
        return;
      }
      Alert.alert('Falha no login com Google', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>Faça login para continuar sua jornada fitness</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="E-mail"
          placeholder="john@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Senha"
          placeholder="******"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Entrar com Google"
          onPress={handleGoogleLogin}
          loading={googleLoading}
          variant="secondary"
          style={styles.button}
        />

        <Button
          title="Criar Conta"
          onPress={() => navigation.navigate('Register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}; const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
});
