import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface UsersAttributes extends Model<InferAttributes<UsersAttributes>, InferCreationAttributes<UsersAttributes>> {
  id?: CreationOptional<number>;
  telegram_id?: number;
  username?: string;
  fullname?: string;
  role?: string;
  last_login_ip?: string;
  register_ip?: string;
  banned?: boolean;
  expired_at?: string;
  created_at?: string;
}

export interface AuthListAttributes extends Model<InferAttributes<AuthListAttributes>, InferCreationAttributes<AuthListAttributes>> {
  id?: CreationOptional<number>;
  user_id?: number;
  telegram_key?: string;
  token?: string;
  bot_name?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ResultLogAttributes {
  user_id?: number;
  success?: boolean;
  text?: string;
  created_at?: string;
}

type license = 'editorial' | 'enhanced' | 'commercial'
type sort = 'popular' | 'newest' | 'random' | 'relevance' | 'artist' | 'bpm' | 'duration' | 'freshness' | 'ranking_all' | 'score' | 'title'
type orientation = 'horizontal' | 'vertical'
type sort_order = 'asc' | 'desc'
type region = 'cs' | 'da' | 'en' | 'de' | 'el' | 'es' | 'fi' | 'fr' | 'hu' | 'it' | 'ja' | 'ko' | 'nl' | 'no' | 'pl' | 'pt' | 'ru' | 'sv' | 'tr' | 'zh' | 'in'
type image_type = 'illustration' | 'vector' | 'photos'

export interface SearchQueryAttributes {
  query: string
  license?: license[]
  sort?: sort
  orientation?: orientation
  page?: string | number
  per_page?: string | number
  sort_order?: sort_order
  language?: region
  region?: region
  people_number?: string
  width_from?: string
  height_from?: string
}