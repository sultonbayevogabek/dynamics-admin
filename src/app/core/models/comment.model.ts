import { IFile } from './file.model';

export interface CommentModel {
  id: string;
  content: string;
  created_at: string;
  objective_id: string;
  replied_comment_id: any;
  is_deleted: boolean;
  files: IFile[];
  created_by: CreatedBy;
}

export interface CreatedBy {
  id: string;
  db_id: string;
  phone: any;
  pinpp: string;
  gender: string;
  birthday: string;
  position: Position;
  username: string;
  verified: boolean;
  full_name: string;
  last_name: string;
  department: Department;
  first_name: string;
  short_name: string;
  middle_name: string;
  mobile_phone: any;
  organization: Organization;
  verified_phone: boolean;
}

export interface Position {
  id: string;
  name_ru: string;
  name_uz: string;
}

export interface Department {
  id: string;
  name_ru: string;
  name_uz: string;
}

export interface Organization {
  id: string;
  name_ru: string;
  name_uz: string;
}
