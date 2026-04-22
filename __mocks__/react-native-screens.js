const { View, Text } = require('react-native');
const React = require('react');

module.exports = {
  enableScreens: jest.fn(),
  Screen: View,
  ScreenContainer: View,
  ScreenStack: View,
  NativeScreen: View,
  NativeScreenContainer: View,
  FullWindowOverlay: View,
  ScreenStackHeaderConfig: View,
};
