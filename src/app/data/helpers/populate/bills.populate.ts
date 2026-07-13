type PopulateOptions = {
  path: string;
  populate?: PopulateOptions[];
};

export const billPopulateHelper: PopulateOptions[] = [
  {
    path: 'notes',
    populate: [
      {
        path: 'discount',
      },
    ],
  },
];
