/**
 * Defines the shape of the data sent to the backend for user registration.
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Defines the shape of the data sent to the backend for user login.
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Defines the shape of the data received from the backend after a successful login/registration.
 */
export interface AuthResponse {
  message: string;
  token: string;
}