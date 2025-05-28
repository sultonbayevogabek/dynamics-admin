import { IFile } from '@shared/interfaces/file.interface';

export interface IBrand {
  _id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  website: string;
  isPopular: boolean;
  logo: IFile;
}
