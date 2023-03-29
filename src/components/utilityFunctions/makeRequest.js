import axios from 'axios';
// eslint-disable-next-line consistent-return
const makeRequest = async (BACKEND_URL,apiEndPoint, method,  dynamicConfig = {}) => {
  const requestDetails = {
    baseURL: BACKEND_URL,
    url: apiEndPoint,
    method,
    ...dynamicConfig
  };
  try {
    const { data } = await axios(requestDetails);
    return data;
  } catch (error) {
    return error;
  }
};
export default makeRequest;
