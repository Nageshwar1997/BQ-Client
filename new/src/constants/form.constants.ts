const passwords = { password: '', confirmPassword: '' };

const changePassword = { ...passwords, oldPassword: '' };

export const FORM_DEFAULT_VALUES = {
  passwords,
  changePassword,
  email: { email: '' },
  otp: { otp: '' },
  register: {
    ...passwords,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
  login: {
    loginMethod: 'email',
    email: undefined,
    phoneNumber: undefined,
    password: '',
  },
};
