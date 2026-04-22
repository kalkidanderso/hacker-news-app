import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { hydrateBookmarks } from './src/features/bookmarks/bookmarksSlice';
import { COLORS } from './src/constants';

function AppContent() {
  useEffect(() => {
    store.dispatch(hydrateBookmarks());
  }, []);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.accent,
          background: COLORS.background,
          card: COLORS.surface,
          text: COLORS.text,
          border: COLORS.border,
          notification: COLORS.accent,
        },
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
