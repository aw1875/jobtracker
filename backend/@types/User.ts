export interface UserDoc {
  id: string;
  username: string;
  accessToken: string;
  jobs: string[];
}

export interface User {
  id?: string;
  displayName?: string;
  username?: string;
  profileUrl?: string;
  photos?: Photo[];
  provider?: string;
  _raw?: string;
  _json?: JSON;
}

export interface JSON {
  login?: string;
  id?: number;
  node_id?: string;
  avatar_url?: string;
  gravatar_id?: string;
  url?: string;
  html_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
  organizations_url?: string;
  repos_url?: string;
  events_url?: string;
  received_events_url?: string;
  type?: string;
  site_admin?: boolean;
  name?: string;
  company?: null;
  blog?: string;
  location?: null;
  email?: null;
  hireable?: boolean;
  bio?: string;
  twitter_username?: null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Photo {
  value?: string;
}
