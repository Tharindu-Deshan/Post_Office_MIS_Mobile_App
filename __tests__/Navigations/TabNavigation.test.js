import React from 'react';
import { render } from '@testing-library/react-native';
import TabNavigation from '../../App/Navigations/TabNavigation';
import AuthContext from '../../App/context/AuthContextProvider';


test('Home and Profile tabs are always enabled', () => {
  const deliveryDetails = { status: 'Completed' };
  const { getByText } = render(
    <AuthContext value={{ deliveryDetails }}>
      <TabNavigation />
    </AuthContext>
  );
  
  const homeTab = getByText('Home').parent;
  const profileTab = getByText('Profile').parent;

  expect(homeTab.props.style.opacity).toBe(1);
  expect(profileTab.props.style.opacity).toBe(1);
});
