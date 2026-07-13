type PopulateOptions = {
  path: string;
  populate?: PopulateOptions[];
};

export const togoPopulateHelper: PopulateOptions[] = [
  {
    path: 'payment',
  },
];
