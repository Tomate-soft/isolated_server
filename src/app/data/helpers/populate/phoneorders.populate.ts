type PopulateOptions = {
  path: string;
  populate?: PopulateOptions[];
};

export const phonePopulateHelper: PopulateOptions[] = [
  {
    path: 'payment',
  },
];
