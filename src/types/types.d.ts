import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface UsersAttributes extends Model<InferAttributes<UsersAttributes>, InferCreationAttributes<UsersAttributes>> {
  id?:              CreationOptional<string>;
  email?:           string;
  password?:        string;
  username?:        string;
  fullname?:        string;
  role?:            string;
  last_login_ip?:   string;
  register_ip?:     string;
  balance?:         number;
  banned?:          boolean;
  banned_reason?:   string;
  avatar?:          string;
  oauth_id?:        string;
  salt?:            string;
  created_at?:      Date;
  updated_at?:      Date;
}

export type ValidationTypes = 'email' | 'number' | 'string' | 'url' | 'min' | 'max'

type license = 'editorial' | 'enhanced' | 'commercial'
type sort = 'popular' | 'newest' | 'random' | 'relevance' | 'artist' | 'bpm' | 'duration' | 'freshness' | 'ranking_all' | 'score' | 'title'
type orientation = 'horizontal' | 'vertical'
type sort_order = 'asc' | 'desc'
type region = 'cs' | 'da' | 'en' | 'de' | 'el' | 'es' | 'fi' | 'fr' | 'hu' | 'it' | 'ja' | 'ko' | 'nl' | 'no' | 'pl' | 'pt' | 'ru' | 'sv' | 'tr' | 'zh' | 'in'
type image_type = 'illustration' | 'vector' | 'photo'

export interface SearchQueryAttributes {
  query:          string
  license?:       license[]
  sort?:          sort
  orientation?:   orientation
  page?:          string | number
  per_page?:      string | number
  sort_order?:    sort_order
  language?:      region
  region?:        region
  people_number?: string
  width_from?:    string
  height_from?:   string
  image_type?:    image_type | image_type[]
}

export interface GetModelsRespose {
  id:                 string 
  name:               string
  author_url:         string
  license_url:        string
  family:             string
  pipelines:          string
  base_resolution: {
    width:            number
    height:           number
  }
  price:              number
  created_at:         Date
}

export interface DiffusionXLAttributes {
  model?:             string
  prompt:             string
  negative_prompt?:   string
  prompt_2?:          string
  negative_prompt_2?: string
  width?:             number
  height?:            number
  steps?:             number
  guidance?:          number
  seed?:              number
  scheduler?:         'euler'
  output_format?:     'jpeg' | 'png'
  response_format?:   'url' | 'b64'
}

export interface DiffusionXLResponse {
  url?:   string
  image?: string
  seed?:  number
  cost?:  number
}