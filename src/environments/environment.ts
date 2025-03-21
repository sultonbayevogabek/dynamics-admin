export const environment = {
  production: false,
  googleAuthParams: {
    client_id: '2803466287-fq6t97fbmls43nvu29nkhhtioh6tfemv.apps.googleusercontent.com',
    redirect_uri: window.location.origin + '/oauth-callback',
    response_type: 'id_token',
    scope: 'email profile openid',
    nonce: '123456789'
  },
  host: 'https://backend.dynamics-market.uz/'
};
