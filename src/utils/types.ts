export interface JobApplication {
  company: string;
  title: string;
  date: Date;
  contact: string;
  status: string;
  location: string;
  notes: string;
  _id: string;
  __v: number;
}

export interface Header {
  Cookie: string;
}

export interface UpdateJobProps {
  _id: string;
  status: string;
  notes: string;
  headers: Header;
}

export interface AddJobProps {
  company: string;
  title: string;
  date: Date;
  contact: string;
  status: string;
  location: string;
  notes: string;
  headers: Header;
}

export interface DeleteJobProps {
  _id: string;
  headers: Header;
}

export interface SearchResult {
  name: string;
  domain: string;
  logo: string;
}
