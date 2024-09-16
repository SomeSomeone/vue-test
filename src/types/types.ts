export type Capital = {
  capitalName: string;
  countryName: string;
  latlng: [number, number];
  region:string,
  distance?: number; // Optional since it's added later in computed
};
