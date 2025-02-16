export interface IUser {
  _id: string;
  firstName: string;
  email: string;
  lastName: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  telegram: string;
  gender: 'male' | 'female';
  address: string;
  regionId: string;
  districtId: string;
  locations: { long: number; lat: number }[];
}
