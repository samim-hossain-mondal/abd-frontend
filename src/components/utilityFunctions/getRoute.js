import { ANNOUNCEMENTS_PAGE_NAME, ANNOUNCEMENTS_ROUTE, CALENDAR_PAGE_NAME, CALENDAR_ROUTE, HOME_PAGE_NAME, HOME_ROUTE, INFORMATION_RADIATORS_PAGE_NAME, INFORMATION_RADIATORS_ROUTE, MADE_TO_STICK_PAGE_NAME, MADE_TO_STICK_ROUTE, OUR_TEAM_PAGE_NAME, OUR_TEAM_ROUTE, PO_NOTE_PAGE_NAME, PO_NOTE_ROUTE, REFERENCE_MATERIALS_PAGE_NAME, REFERENCE_MATERIALS_ROUTE, DAILY_ROUTE, DAILY_PAGE_NAME } from '../constants/routes';

const getRoute = (PAGE_NAME, pId) => {

  if (!pId) return HOME_ROUTE;

  const projectId = pId ? `/${pId}` : ""

  switch (PAGE_NAME) {
    case HOME_PAGE_NAME:
      return `${HOME_ROUTE}`;
    case DAILY_PAGE_NAME:
      return `${projectId}${DAILY_ROUTE}`;
    case PO_NOTE_PAGE_NAME:
      return `${projectId}${PO_NOTE_ROUTE}`;
    case OUR_TEAM_PAGE_NAME:
      return `${projectId}${OUR_TEAM_ROUTE}`;
    case CALENDAR_PAGE_NAME:
      return `${projectId}${CALENDAR_ROUTE}`;
    case ANNOUNCEMENTS_PAGE_NAME:
      return `${projectId}${ANNOUNCEMENTS_ROUTE}`;
    case REFERENCE_MATERIALS_PAGE_NAME:
      return `${projectId}${REFERENCE_MATERIALS_ROUTE}`;
    case INFORMATION_RADIATORS_PAGE_NAME:
      return `${projectId}${INFORMATION_RADIATORS_ROUTE}`;
    case MADE_TO_STICK_PAGE_NAME:
      return `${projectId}${MADE_TO_STICK_ROUTE}`;
    default:
      return '*';
  }
}

export default getRoute;