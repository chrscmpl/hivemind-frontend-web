export const environment = {
  origin: 'http://localhost:4200',
  api: 'http://localhost',
  passwordStrengthPatterns: {
    medium: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/,
    strong: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{12,}$/,
  },
};
