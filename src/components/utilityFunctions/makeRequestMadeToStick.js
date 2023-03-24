import axios from 'axios';

const makeRequest = async (BACKEND_URL,apiEndPoint, method,  dynamicConfig = {}) => {
  const requestDetails = {
    baseURL: BACKEND_URL,
    url: apiEndPoint,
    method,
    ...dynamicConfig
  };
  const { data } = await axios(requestDetails);
  return data;
};
export default makeRequest;
