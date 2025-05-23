export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}


export interface BodyDownloadUrl {
  url: string;
}


export interface MediaBase {
  id: number;
  title: string;
  filepath: string;
  created_at: string;
}


export interface Tag {
  id: number;
  name: string;
}

export interface Media extends MediaBase {
  tags: Tag[];
  thumbnail_path: string | null;
  platform_id: number | null;
  owner_id: number | null;
  url_id: number | null;
  name: string;
  type: string;
  url: string;
}


export interface Platform {
  id: number;
  name: string;
}


export interface Profile {
  owner_id?: number;
  owner_name: string;
  updated_at?: string;
}


export interface BodyAddTags {
  media_id: number;
  tag_names: string[];
}


export interface BodyRemoveTags {
  media_id: number;
  tag_ids: number[];
}