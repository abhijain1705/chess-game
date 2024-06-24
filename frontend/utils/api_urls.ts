const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const CHESS_APIS = {
  AUTH_APIS: {
    SIGN_UP: AUTH_API_URL + "/signup",
    LOG_IN: AUTH_API_URL + "/login",
    FORGOT_PASSWORD: AUTH_API_URL + "/forgot-password",
    RESET_PASSWORD: AUTH_API_URL + "/reset-password",
    GET_USER_FROM_EMAIL: AUTH_API_URL + "/getUserFromEmail",
    GET_USER_FROM_NAME: AUTH_API_URL + "/getUserFromName",
  },
};
