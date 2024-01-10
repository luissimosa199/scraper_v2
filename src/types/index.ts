interface Review {
  author: string;
  date: string;
  comment: string;
  rate: null;
  origin: string;
  firstScanned: number;
  updatedAt: null;
}

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
  reviews?: Review[];
}
