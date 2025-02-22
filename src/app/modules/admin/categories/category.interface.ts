export interface ICategory {
  _id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  parentId: string;
  images: string[];
  children: ICategory[];
  showChildren: boolean;
}
