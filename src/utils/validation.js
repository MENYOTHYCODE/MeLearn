// Form validation utilities

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid boolean, error message, and strength score
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required',
      strength: 0
    };
  }

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 0;
  let errors = [];

  // Check minimum length
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  } else {
    strength += 1;
  }

  // Check for uppercase letters
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 1;
  }

  // Check for lowercase letters
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 1;
  }

  // Check for numbers
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 1;
  }

  // Check for special characters (optional for basic validation)
  if (hasSpecialChar) {
    strength += 1;
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    error: errors.length > 0 ? errors[0] : null, // Return first error
    errors: errors,
    strength: Math.min(strength, 5), // Max strength of 5
    strengthLabel: getPasswordStrengthLabel(strength)
  };
}

/**
 * Get password strength label
 * @param {number} strength - Strength score (0-5)
 * @returns {string} Strength label
 */
function getPasswordStrengthLabel(strength) {
  switch (strength) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Fair';
    case 4:
      return 'Good';
    case 5:
      return 'Strong';
    default:
      return 'Unknown';
  }
}

/**
 * Validate required field
 * @param {string} value - Field value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateRequired(value, fieldName = 'Field') {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validate full name
 * @param {string} fullName - Full name to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateFullName(fullName) {
  const requiredValidation = validateRequired(fullName, 'Full name');
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }

  const trimmedName = fullName.trim();
  
  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters long'
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: 'Full name must be less than 50 characters long'
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Full name can only contain letters, spaces, hyphens, and apostrophes'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Format error message for display
 * @param {string} error - Error message
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  if (!error) return '';
  
  // Ensure error message ends with a period if it doesn't already
  const trimmedError = error.trim();
  if (trimmedError && !trimmedError.endsWith('.') && !trimmedError.endsWith('!') && !trimmedError.endsWith('?')) {
    return trimmedError + '.';
  }
  
  return trimmedError;
}

/**
 * Validate entire login form
 * @param {Object} formData - Login form data
 * @param {string} formData.email - Email address
 * @param {string} formData.password - Password
 * @returns {Object} Validation result with isValid boolean and errors object
 */
export function validateLoginForm(formData) {
  const errors = {};
  let isValid = true;

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validate password
  const passwordValidation = validateRequired(formData.password, 'Password');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  return {
    isValid,
    errors
  };
}

/**
 * Validate entire registration form
 * @param {Object} formData - Registration form data
 * @param {string} formData.fullName - Full name
 * @param {string} formData.email - Email address
 * @param {string} formData.password - Password
 * @param {string} formData.confirmPassword - Password confirmation
 * @returns {Object} Validation result with isValid boolean and errors object
 */
export function validateRegistrationForm(formData) {
  const errors = {};
  let isValid = true;

  // Validate full name
  const nameValidation = validateFullName(formData.fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
    isValid = false;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(
    formData.password, 
    formData.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error;
    isValid = false;
  }

  return {
    isValid,
    errors,
    passwordStrength: passwordValidation.strength,
    passwordStrengthLabel: passwordValidation.strengthLabel
  };
}