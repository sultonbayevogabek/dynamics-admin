export interface IFile {
  id: string
  db_id: string
  created_at: string
  created_by: string
  is_deleted: boolean
  type: string
  name: string
  size: number
  content_size: number
  is_private: boolean
  file_host_id: number
  hash: string
  last_modified: any
  info: any
  is_minio: boolean
  migrated: boolean
  content: Content
  totalPartCount: number
  completedPartCount: number
}

export interface Content {
  type: string
  data: number[]
}
