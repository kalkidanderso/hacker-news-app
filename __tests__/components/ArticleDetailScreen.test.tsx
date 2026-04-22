import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer from '../../src/features/feed/feedSlice';
import bookmarksReducer from '../../src/features/bookmarks/bookmarksSlice';
import { ArticleDetailScreen } from '../../src/features/feed/ArticleDetailScreen';
import type { NormalizedStory } from '../../src/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockSetOptions = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const mockStory: NormalizedStory = {
  id: 42,
  title: 'Testing React Native Applications',
  url: 'https://reactnative.dev/docs/testing',
  domain: 'reactnative.dev',
  faviconUrl: 'https://www.google.com/s2/favicons?domain=reactnative.dev&sz=64',
  score: 312,
  by: 'tester',
  time: Math.floor(Date.now() / 1000) - 7200,
  type: 'story',
};

const mockNavigation = {
  setOptions: mockSetOptions,
  navigate: mockNavigate,
  goBack: mockGoBack,
} as never;

const mockRoute = {
  key: 'ArticleDetail-1',
  name: 'ArticleDetail' as const,
  params: { story: mockStory },
} as never;

function makeStore() {
  return configureStore({
    reducer: { feed: feedReducer, bookmarks: bookmarksReducer },
  });
}

function Wrapper() {
  return (
    <Provider store={makeStore()}>
      <ArticleDetailScreen navigation={mockNavigation} route={mockRoute} />
    </Provider>
  );
}

describe('ArticleDetailScreen', () => {
  beforeEach(() => {
    mockSetOptions.mockClear();
  });

  it('renders the story title', () => {
    render(<Wrapper />);
    expect(screen.getByText(mockStory.title)).toBeTruthy();
  });

  it('renders the domain source badge', () => {
    render(<Wrapper />);
    expect(screen.getByText(mockStory.domain)).toBeTruthy();
  });

  it('renders the author line', () => {
    render(<Wrapper />);
    expect(screen.getByText(`by ${mockStory.by}`)).toBeTruthy();
  });

  it('calls setOptions with a headerRight function on mount', () => {
    render(<Wrapper />);
    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.objectContaining({ headerRight: expect.any(Function) }),
    );
  });

  it('renders a headerRight with a bookmark button that toggles on press', () => {
    const sharedStore = makeStore();

    function SharedWrapper() {
      return (
        <Provider store={sharedStore}>
          <ArticleDetailScreen navigation={mockNavigation} route={mockRoute} />
        </Provider>
      );
    }

    render(<SharedWrapper />);

    const getHeaderRight = () =>
      (mockSetOptions.mock.calls[mockSetOptions.mock.calls.length - 1][0] as {
        headerRight: () => React.ReactElement;
      }).headerRight;

    const { getByLabelText, rerender } = render(
      <Provider store={sharedStore}>{getHeaderRight()()}</Provider>,
    );

    expect(getByLabelText('Add bookmark')).toBeTruthy();
    fireEvent.press(getByLabelText('Add bookmark'));

    rerender(<Provider store={sharedStore}>{getHeaderRight()()}</Provider>);
    expect(getByLabelText('Remove bookmark')).toBeTruthy();
  });
});
