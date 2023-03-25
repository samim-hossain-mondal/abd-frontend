const GENERIC_NAME = "PO Note";
const placeholder = {
  'ACTION_ITEM': 'Example: PO is to get the marketing approvals for the Payment screen text content by Monday so that we are prepared for our next sprint.',
  'KEY_DECISION': 'Example: The client suggested to use Stripe for payment integration as they already have corporate subscription.',
  'AGENDA_ITEM': 'Example: Which cloud platform are we choosing to host our app? Our Client team wants to know by this week.'
}

const actionItems = {
  'heading': 'Action Items',
  'definition': ' are the tasks that the Product Owner(PO) has to do in order to unblock the team, and can be linked to an issue in the Project management tool such as Jira.',
  'accessibilityInformation': 'PO is the owner of this section only PO can add or edit these entries.'
}

const keyDecisions = {
  'heading': 'Key Decisions',
  'definition': ' are the decisions that the Product Owner(PO) has to make in order to unblock the team, and can be linked to an issue in the Project management tool such as Jira.',
  'accessibilityInformation': 'PO is the owner of this section only PO can add or edit these entries.'
}

const agendaItems = {
  'heading': 'Agenda Items',
  'definition': ' are the topics that the Product Owner(PO) has to discuss with the team in order to unblock the team, and can be linked to an issue in the Project management tool such as Jira.',
  'accessibilityInformation': 'PO is the owner of this section only PO can add or edit these entries.'
}

const noteTypes = ['Action Item', 'Key Decision', 'Open Question'];

const collaborators = ['Kartik Goel', 'Samim Gupta', 'Abhishek Bharadwaj'];

export { GENERIC_NAME, placeholder, actionItems, keyDecisions, agendaItems, collaborators, noteTypes };

export const poNotesStatus = ['PENDING', 'COMPLETED', 'DRAFT'];