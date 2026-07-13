type PopulateOptions = {
  path: string;
  populate?: PopulateOptions[];
};

export const rappiPopulateHelper: PopulateOptions[] = [
  {
    path: 'payment',
  },
];
