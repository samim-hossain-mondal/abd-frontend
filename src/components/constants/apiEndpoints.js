export const GET_ME = {
  url: "api/management/me",
  method: 'get',
}

export const GET_PO_NOTES = (projectId) => ({
  url: `api/po-notes/${projectId}`,
  method: 'get',
})

// ***** poNotes Endpoints *****

export const GET_PO_NOTE_BY_ID = (projectId, poNoteId) => ({
  url: `api/po-notes/${projectId}/${poNoteId}`,
  method: 'get',
})

export const CREATE_PO_NOTE = (projectId) => ({
  url: `api/po-notes/${projectId}`,
  method: 'post',
})

export const PATCH_PO_NOTE = (projectId, poNoteId) => ({
  url: `api/po-notes/${projectId}/${poNoteId}`,
  method: 'patch',
})

export const DELETE_PO_NOTE = (projectId, poNoteId) => ({
  url: `api/po-notes/${projectId}/${poNoteId}`,
  method: 'delete',
})

// ***** celebrations  Endpoints *****

export const GET_CELEBRATIONS = (projectId) => ({
  url: `api/dsm/celebrations/${projectId}`,
  method: 'get',
})

export const GET_CELEBRATION_BY_ID = (projectId, celebrationId) => ({
  url: `api/dsm/celebrations/${projectId}/${celebrationId}`,
  method: 'get',
})

export const CREATE_CELEBRATION = (projectId) => ({
  url: `api/dsm/celebrations/${projectId}`,
  method: 'post',
})

export const UPDATE_CELEBRATION = (projectId, celebrationId) => ({
  url: `api/dsm/celebrations/${projectId}/${celebrationId}`,
  method: 'patch',
})

export const DELETE_CELEBRATION = (projectId, celebrationId) => ({
  url: `api/dsm/celebrations/${projectId}/${celebrationId}`,
  method: 'delete',
})

// ***** Celebration Reactions *****

export const GET_CELEBRATION_REACTION = (projectId, celebrationId) => ({
  url: `api/dsm/celebrations/${projectId}/${celebrationId}/react`,
  method: 'get',
})

export const UPDATE_CELEBRATION_REACTION = (projectId, celebrationId) => ({
  url: `api/dsm/celebrations/${projectId}/${celebrationId}/react`,
  method: 'patch',
})

// ***** requests  Endpoints *****

export const GET_TEAM_REQUESTS = (projectId) => ({
  url: `api/dsm/team-requests/${projectId}`,
  method: 'get',
})

export const CREATE_TEAM_REQUEST = (projectId) => ({
  url: `api/dsm/team-requests/${projectId}`,
  method: 'post',
})

export const UPDATE_TEAM_REQUEST = (projectId, requestId) => ({
  url: `api/dsm/team-requests/${projectId}/${requestId}`,
  method: 'put',
})

export const DELETE_TEAM_REQUEST = (projectId, requestId) => ({
  url: `api/dsm/team-requests/${projectId}/${requestId}`,
  method: 'delete',
})

// ***** announcments  Endpoints *****

export const GET_ANNOUNCMENTS = (projectId) => ({
  url: `api/dsm/announcements/${projectId}`,
  method: 'get',
})

export const CREATE_ANNOUNCMENT = (projectId) => ({
  url: `api/dsm/announcements/${projectId}`,
  method: 'post',
})

// ***** sentiments  Endpoints *****

export const GET_SENTIMENTS = (projectId) => ({
  url: `api/dsm/sentiment-meter/${projectId}`,
  method: 'get',
})

export const GET_SENTIMENT_BY_ID = (projectId, sentimentId) => ({
  url: `api/dsm/sentiment-meter/${projectId}/${sentimentId}`,
  method: 'get',
})

export const CREATE_SENTIMENT = (projectId) => ({
  url: `api/dsm/sentiment-meter/${projectId}`,
  method: 'post',
})

export const UPDATE_SENTIMENT = (projectId, sentimentId) => ({
  url: `api/dsm/sentiment-meter/${projectId}/${sentimentId}`,
  method: 'patch',
})

export const DELETE_SENTIMENT = (projectId, sentimentId) => ({
  url: `api/dsm/sentiment-meter/${projectId}/${sentimentId}`,
  method: 'delete',
})

// ***** leave Endpoints *****

export const GET_LEAVES = (projectId) => ({
  url: `api/leaves/${projectId}`,
  method: 'get',
})

export const CREATE_LEAVE = (projectId) => ({
  url: `api/leaves/${projectId}`,
  method: 'post',
})

export const UPDATE_LEAVE = (projectId, leaveId) => ({
  url: `api/leaves/${projectId}/${leaveId}`,
  method: 'put',
})

export const DELETE_LEAVE = (projectId, leaveId) => ({
  url: `api/leaves/${projectId}/${leaveId}`,
  method: 'delete',
})

// ***** projects  Endpoints *****

export const GET_PROJECTS = {
  url: "api/management/project",
  method: 'get',
}

export const GET_PROJECT_BY_ID = (projectId) => ({
  url: `api/management/project/${projectId}`,
  method: 'get',
})

export const DUMY = {}

// export const GET_PO_NOTES = {
//   url: `${BACKEND_URL}/po-notes`,
//   method: 'get',
// }

// export const CREATE_PO_NOTE = {
//   url: `${BACKEND_URL}/po-notes`,
//   method: 'post',
// }

// export const UPDATE_PO_NOTE = {
//   url: `${BACKEND_URL}/po-notes`,
//   method: 'patch',
// }
 export const GET_TEAM_INFORMATION_BY_PROJECT_ID= (projectId) => ({
  url: `api/teamInformations/projectId/${projectId}`,
  method: 'GET',
})
export const POST_TEAM_INFORMATION = {
  url: `api/teamInformations`,
  method: 'POST',
}
export const PUT_TEAM_INFORMATION = (id)=>({
  url: `api/teamInformations/${id}`,
  method: 'PUT',

})
export const DELETE_TEAM_INFORMATION = (id)=>({
  url: `api/teamInformations/${id}`,
  method: 'DELETE',
})
