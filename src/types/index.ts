export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  type: string;
}

export interface NormalizedStory extends Story {
  domain: string;
  faviconUrl: string;
}

export type SortKey = 'score' | 'time';

export type RootStackParamList = {
  ArticleList: undefined;
  ArticleDetail: { story: NormalizedStory };
};

export type TabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};
