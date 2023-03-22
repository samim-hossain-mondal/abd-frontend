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
 export const GET_TEAM_INFORMATION_BY_PROJECT_ID= (projectId) => ({
  url: `${BACKEND_URL}/teamInformations/projectId/${projectId}`,
  method: 'GET',
})
export const POST_TEAM_INFORMATION = {
  url: `${BACKEND_URL}/teamInformations`,
  method: 'POST',
}
export const PUT_TEAM_INFORMATION = (id)=>({
  url: `${BACKEND_URL}/teamInformations/${id}`,
  method: 'PUT',

})
export const DELETE_TEAM_INFORMATION = (id)=>({
  url: `${BACKEND_URL}/teamInformations/${id}`,
  method: 'DELETE',
})
