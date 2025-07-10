export interface IOrder {
  _id: string
  firstName: string
  lastName: string
  email: string
  userId: string
  items: Item[]
  orderCode: string
  comment: string
  customerType: string
  companyName: string
  phone: string
  status: Status
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Item {
  productId: string
  nameUz: string
  nameRu: string
  nameEn: string
  sku: string
  quantity: number
  price: any
  _id: string
}

export interface Status {
  _id: string
  nameUz: string
  nameRu: string
  nameEn: string
  color: string
  static: boolean
  index: number
  createdAt: string
  updatedAt: string
  __v: number
}
