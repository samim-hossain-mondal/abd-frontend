export const BACKEND_URL = 'http://localhost:3001';
export const GET_MADE_TO_STICK_CARDS = `${BACKEND_URL}/api/madeToStick`;

export const PUT_MADE_TO_STICK_CARDS = (i) => ({
  url: `${BACKEND_URL}/api/madeToStick/${i}`,
  method: 'PUT',
});
export const DELETE_MADE_TO_STICK_CARDS = (i) => ({
    url: `${BACKEND_URL}/api/madeToStick/${i}`,
    method: 'DELETE',
});
export const POST_MADE_TO_STICK_CARDS = {
    url: `${BACKEND_URL}/api/madeToStick`,
    method: 'POST',
};