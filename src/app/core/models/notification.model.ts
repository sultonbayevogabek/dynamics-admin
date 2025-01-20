export interface NotificationModel {
  id: string
  title: string
  body: string
  receiver_user_id: string
  db_id: string
  type: number
  created_at: string
  is_deleted: boolean
  read: boolean
  details: Details
}

export interface Details {
  key_id?: string
  objective_id?: string
}
