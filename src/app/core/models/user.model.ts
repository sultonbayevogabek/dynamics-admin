export interface UserModel {
  id: string;
  db_id: string;
  position_id: string;
  username: string;
  department_id: string;
  file_id: any;
  middle_name: string;
  last_name: string;
  order_by: number;
  is_deleted: boolean;
  created_at: string;
  first_name: string;
  verified: boolean;
  sequence_index: any;
  verified_phone: boolean;
  operator_number: any;
  personal_code: string;
  full_name: string;
  text: string;
  org_main_parent_id: string;
  org_tin: string;
  address: string;
  org_verified: boolean;
  region_id: string;
  district_id: string;
  db_name: string;
  department_name: string;
  position_name: string;
  position?: string;
  position_json: PositionJson;
  phone: any;
  pinpp: string;
  permissions: string[];
  has_contract: boolean;
  contract: Contract;
  version: any;
  iat: number;
  exp: number;
  img: string;
  gender: 'male' | 'female';
  birthday: string;
  passport_number: string;
}

export interface PositionJson {
  ru: string;
  uz: string;
  uz_latn: string;
}

export interface Contract {
}

