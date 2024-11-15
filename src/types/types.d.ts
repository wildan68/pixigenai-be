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

interface TripoHaystackPayload {
  id:               number
  task_id:          string
  thumbnail_url:    string
  glb_url:          string
  prompt:           string
  type:             string
  draft_model_id:   string | null
}

export interface TripoHaystackResponse {
  message: string
  code :   number
  payload: TripoHaystackPayload[]
}

export interface ModelsAttributes extends Model<InferAttributes<ModelsAttributes>, InferCreationAttributes<ModelsAttributes>> {
  id?:                  CreationOptional<string>
  user_id?:             string
  glb_asset_id?:        string
  glb_path?:            string
  draft_model_id?:      string | null
  prompt?:              string
  task_id?:             string
  thumbnail_asset_id?:  string
  thumbnail_url?:       string
  type?:                string
  is_private?:          boolean
  created_at?:          Date
  updated_at?:          Date
}

export interface TasksAttributes extends Model<InferAttributes<TasksAttributes>, InferCreationAttributes<TasksAttributes>> {
  id?:          CreationOptional<string>
  task_id?:     string
  user_id?:     string
  status?:      string
  created_at?:  Date
  updated_at?:  Date
}

interface BaseModel {
  type: 'text_to_model' | 'image_to_model' | 'multiview_to_model'
}

interface FileModel {
  file: {
    type:         'jpg' | 'png'
    file_token:   string
  }
}

interface TextToModel extends BaseModel {
  type:   'text_to_model'
  prompt: string
}

interface ImageToModel extends BaseModel {
  type: 'image_to_model'
  file: FileModel
}

interface MultiviewToModel extends BaseModel {
  type:  'multiview_to_model'
  files: FileModel[]
  mode: 'LEFT' | 'RIGHT'
}

export type GenerateModelPayload = TextToModel | ImageToModel | MultiviewToModel