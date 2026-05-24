/**
 * Validation Utilities
 * Reusable validation functions
 */

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  const re = /^\d{10,}$/;
  return re.test(phone.replace(/\D/g, ""));
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
};
