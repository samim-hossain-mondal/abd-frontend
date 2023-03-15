export const BACKEND_URL = 'http://localhost:3001/api';

export const GET_PO_NOTES = {
  url: `${BACKEND_URL}/po-notes`,
  method: 'GET',
}

export const CREATE_PO_NOTE = {
  url: `${BACKEND_URL}/po-notes`,
  method: 'POST',
}

export const UPDATE_PO_NOTE = {
  url: `${BACKEND_URL}/po-notes`,
  method: 'PATCH',
}
