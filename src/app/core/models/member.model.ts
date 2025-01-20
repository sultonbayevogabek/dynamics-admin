export interface PerformerModel {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  db_id: string;
  created_at: string;
  short_name: string;
}

export interface MemberModel {
  id: string;
  full_name: string;
  objectives_count: string;
  keys_count: string;
  position_name: string;
  file_id: string;
}
