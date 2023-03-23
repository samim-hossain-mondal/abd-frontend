export function getCurretUser() {
  return 'Test User';
};

export function getCurrentUserID() {
  try{
    const oktaToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    return oktaToken.accessToken.claims.uid;
  }
  catch(err){
    return null;
  }
};

export function getAllUsers() {
  return ['Test User', 'Test User 2', 'Test User 3', 'Random User'];
};

export default { getCurretUser, getCurrentUserID, getAllUsers };