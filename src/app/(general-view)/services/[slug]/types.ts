export interface ServiceDetail {
  title: string;
  price: number;
  summary: string;
  details: string[];
  serviceCode: string;
  image: string;
  tests?: { name: string; price: number; serviceCode: string }[];
  applicationOptions?: { name: string; price: number; serviceCode: string }[];
}
