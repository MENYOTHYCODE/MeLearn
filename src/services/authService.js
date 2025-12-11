// Authentication service utilities
export class AuthService {
  static STORAGE_KEYS = {
    USERS: 'melearn_users',
    USER: 'melearn_user',
    SESSION: 'melearn_session'
  };

  static SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Validate login credentials against stored user data
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Object} Validation result with user data or error
   */
  static validateCredentials(credentials) {
    try {
      const users = this.getStoredUsers();
      const user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      );

      if (!user) {
        return {
          isValid: false,
          error: 'Invalid email or password'
        };
      }

      return {
        isValid: true,
        user: user
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Authentication service error'
      };
    }
  }

  /**
   * Create a new user account
   * @param {Object} userData - Registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Object} Creation result with user data or error
   */
  static createUser(userData) {
    try {
      const users = this.getStoredUsers();
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password, // In production, this would be hashed
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save user
      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));

      return {
        success: true,
        user: newUser
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create user account'
      };
    }
  }

  /**
   * Store user session data
   * @param {Object} user - User object to store
   * @returns {boolean} Success status
   */
  static storeSession(user) {
    try {
      const sessionData = {
        timestamp: Date.now(),
        userId: user.id
      };

      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      
      return true;
    } catch (error) {
      console.error('Failed to store session:', error);
      return false;
    }
  }

  /**
   * Retrieve stored session data
   * @returns {Object|null} User data if session is valid, null otherwise
   */
  static retrieveSession() {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      const sessionData = localStorage.getItem(this.STORAGE_KEYS.SESSION);

      if (!userData || !sessionData) {
        return null;
      }

      const user = JSON.parse(userData);
      const session = JSON.parse(sessionData);

      // Check if session is still valid
      const sessionAge = Date.now() - session.timestamp;
      
      if (sessionAge > this.SESSION_DURATION) {
        this.clearSession();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear all session data
   * @returns {boolean} Success status
   */
  static clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.USER);
      localStorage.removeItem(this.STORAGE_KEYS.SESSION);
      return true;
    } catch (error) {
      console.error('Failed to clear session:', error);
      return false;
    }
  }

  /**
   * Update user's last login timestamp
   * @param {string} userId - User ID
   * @returns {Object|null} Updated user data or null
   */
  static updateLastLogin(userId) {
    try {
      const users = this.getStoredUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return null;
      }

      users[userIndex].lastLogin = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
      
      return users[userIndex];
    } catch (error) {
      console.error('Failed to update last login:', error);
      return null;
    }
  }

  /**
   * Get all stored users
   * @returns {Array} Array of user objects
   */
  static getStoredUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]');
    } catch (error) {
      console.error('Failed to get stored users:', error);
      return [];
    }
  }

  /**
   * Check if session exists and is valid
   * @returns {boolean} Session validity status
   */
  static isSessionValid() {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEYS.SESSION);
      
      if (!sessionData) {
        return false;
      }

      const session = JSON.parse(sessionData);
      const sessionAge = Date.now() - session.timestamp;
      
      return sessionAge <= this.SESSION_DURATION;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object|null} User object or null
   */
  static getUserById(userId) {
    try {
      const users = this.getStoredUsers();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      return null;
    }
  }
}