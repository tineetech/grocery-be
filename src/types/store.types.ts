// types/store.types.ts

export interface IStoreInput {
  store_name: string;
  address: string;
  subdistrict?: string;
  city: string;
  city_name: string;
  postcode: string;
  latitude: number;
  longitude: number;
  user_id?: number;
}

export interface ICityData {
  city_id: string;
  city_name: string;
  province: string;
  province_id: string;
}
