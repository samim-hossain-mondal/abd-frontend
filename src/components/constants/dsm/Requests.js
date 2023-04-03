export const HEADING = "Team Requests"
export const CHAR_COUNT = 500;

export const GENERIC_NAME = 'Request';
export const DSM_REQUEST_INPUT_PLACEHOLDER = 'Ask your PO for help!\nExample: I would want to have a PS call with design team to understand the payment flow better by today.';
export const DSM_REQUEST_DEFAULT_TYPE = 'MEETING';
export const DSM_REQUEST_TYPES = [
  'MEETING',
  'RESOURCE'
];

export const DSM_REQUEST_STATUS = {
  'PENDING': 'PENDING',
  'APPROVED': 'APPROVED',
  'REJECTED': 'REJECTED'
}

export const isRequestCompleted = (status) => status === DSM_REQUEST_STATUS.APPROVED

export const WATERMARK_FOR_MEMBERS = "Ask your PO for help!"
export const WATERMARK_FOR_PO = "No Requests yet."

export const TITLE = 'Request Statement';
export const PRIMARY_BUTTON_TEXT = {
  'POST': 'Post',
  'SAVE': 'Save'
};