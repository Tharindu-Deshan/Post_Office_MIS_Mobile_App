import React from 'react';
import { View, Text } from 'react-native';
import CommonLayout from '../Components/commonLayout/CommonLayout';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function RouteDisplay() {
  const navigation=useNavigation();
  return (
    <PaperProvider>
      <CommonLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>RouteDisplay</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Profile')}>
            Press me
          </Button>
        </View>
      </CommonLayout>
    </PaperProvider>
  );
}
