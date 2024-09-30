import React from 'react';
import { render } from '@testing-library/react-native';


import TabNavigation from '../../App/Navigations/TabNavigation';
import AuthContext from '../../App/context/AuthContextProvider';

test('TabNavigation renders without crashing', () => {
  const deliveryDetails = { status: 'Assigned' };
  const { getByText } = render(
    <AuthContext.Provider value={{ deliveryDetails }}>
      <TabNavigation />
    </AuthContext.Provider>
  );
  expect(getByText('Home')).toBeTruthy();
  expect(getByText('View Delivery')).toBeTruthy();
  expect(getByText('Route')).toBeTruthy();
  expect(getByText('Profile')).toBeTruthy();
});
