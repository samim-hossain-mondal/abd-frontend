import axios from 'axios';
import { DOMAIN } from '../../../config';
import { FORBIDDEN_MSG, NOT_FOUND_MSG, SERVER_ERROR_MSG, UNAUTHORIZED_MSG } from '../../constants/HttpMessages';
import { HttpError } from '../errors';

const makeRequest = async (apiEndPoint, setLoading, dynamicConfig = {}, navigate = undefined) => {
  try {
    setLoading(true);
    const requestDetails = {
      baseURL: DOMAIN,
      url: apiEndPoint.url,
      method: apiEndPoint.method,
      ...dynamicConfig,
    };
    const { data } = await axios(requestDetails);
    return data;
  } catch (e) {
    if (navigate) {
      const errorStatus = e.response?.status;
      if (errorStatus) {
        // navigate(`${ERROR_ROUTE}/${errorStatus}`);
      } else {
        // navigate(ERROR_ROUTE);
      }
    }
    let message = e.response?.data?.message;
    switch (e.response?.status) {
      case 401:
        message = UNAUTHORIZED_MSG;
        break;
      case 403:
        message = e.response?.data?.message || FORBIDDEN_MSG;
        break;
      case 404:
        message = e.response?.data?.message || `${NOT_FOUND_MSG} Cannot ${apiEndPoint.method.toUpperCase()} ${apiEndPoint.url}.`;
        break;
      case 500:
        message = SERVER_ERROR_MSG;
        break;
      default:
        break;
    }
    throw new HttpError(e.response?.status, message);
  } finally {
    setLoading(false);
  }
};

export default makeRequest;
