import { IFile } from '@shared/interfaces/file.interface';

export interface IBanner {
  _id: string
  titleUz: string
  titleRu: string
  titleEn: string
  textUz: string
  textRu: string
  textEn: string
  images: IFile[]
  hierarchy: Hierarchy[]
  product: Product
  brandIds: string[]
  brandSlugs: string[]
  type: string
  status: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

interface Hierarchy {
  categoryId: string
  categoryNameUz: string
  categoryNameRu: string
  categoryNameEn: string
  _id: string
}

interface Product {
  _id: string;
  slug: string;
  slugRu: string;
  slugEn: string;
  slugUz: string;
}
