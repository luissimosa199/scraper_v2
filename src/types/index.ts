export interface Doctor {
  url: string;
  name: string;
  image: string;
  phones: string[];
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
  };
}
