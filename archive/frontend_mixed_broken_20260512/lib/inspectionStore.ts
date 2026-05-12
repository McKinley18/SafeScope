export const getInspection = () => {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem('inspection');

  return data
    ? JSON.parse(data)
    : {
        meta: {},
        findings: [],
        progress: {
          setup: false,
          build: false,
          report: false,
          review: false,
        },
      };
};

export const saveInspection = (data: any) => {
  localStorage.setItem('inspection', JSON.stringify(data));
};
