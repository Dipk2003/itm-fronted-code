// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

// Google OAuth configuration
export const googleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: window.location.origin + '/auth/google/callback',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' '),
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent'
};

// Helper function to build Google OAuth URL
export const buildGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: googleAuthConfig.client_id,
    redirect_uri: googleAuthConfig.redirect_uri,
    scope: googleAuthConfig.scope,
    response_type: googleAuthConfig.response_type,
    access_type: googleAuthConfig.access_type,
    prompt: googleAuthConfig.prompt
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export default {
  GOOGLE_CLIENT_ID,
  googleAuthConfig,
  buildGoogleAuthUrl
};
