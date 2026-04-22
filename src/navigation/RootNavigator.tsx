import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedStack } from './FeedStack';
import { BookmarksStack } from './BookmarksStack';
import { useAppSelector } from '../hooks/useAppStore';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{name}</Text>
  );
}

export function RootNavigator() {
  const bookmarkCount = useAppSelector(s => s.bookmarks.items.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: SPACING.xs,
          height: 56,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedStack}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ focused }) => <TabIcon name="📰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksStack}
        options={{
          tabBarLabel: 'Bookmarks',
          tabBarIcon: ({ focused }) => <TabIcon name="★" focused={focused} />,
          tabBarBadge: bookmarkCount > 0 ? bookmarkCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
