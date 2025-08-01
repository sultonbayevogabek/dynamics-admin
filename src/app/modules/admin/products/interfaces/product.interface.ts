import { IFile } from '@shared/interfaces/file.interface';
import { IBrand } from '../../brands/brands.interface';

export interface IProduct {
  _id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  slugUz: string;
  slugRu: string;
  slugEn: string;
  attributes: Attribute[];
  sku: string;
  oldPrice: number;
  currentPrice: number;
  quantity: number;
  rate: number;
  categoryId: string;
  brandId: string;
  brand: IBrand;
  images: IFile[];
  thumbs: IFile[];
  status: number;
  isDeleted: boolean;
  details: Details;
  createdAt: string;
  updatedAt: string;
  hierarchy: ProductHierarchy[];
  keywords: string;
  availability: 'on_demand' | 'in_stock' | 'out_of_stock'
  link: string;
}

export interface Attribute {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  _id: string;
}

export interface Details {
  mainCategoryId: string;
  middleCategoryId: string;
}

export interface ProductHierarchy {
  categoryId: string;
  categorySlugUz: string;
  categorySlugRu: string;
  categorySlugEn: string;
  categoryName: string;
  categoryNameUz: string;
  categoryNameRu: string;
  categoryNameEn: string;
  _id: string;
}
