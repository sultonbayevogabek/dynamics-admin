import { IFile } from '@shared/interfaces/file.interface';

export interface ICategory {
  _id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  parentId: string;
  image: IFile;
  children: ICategory[];
  showChildren: boolean;
}
