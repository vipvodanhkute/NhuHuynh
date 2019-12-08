// import 'isomorphic-unfetch';
import axios from 'axios';
import qs from 'qs';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import AuthStorage from './AuthStorage';
import { detectLanguage } from '#/utils/langUtils'

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
let URL = () => {
  let urls = require('./constants').URL; /* eslint-disable-line */
  URL = () => urls;
  return urls;
}

const getAccessToken = async () => {
  if (!AuthStorage.isTokenValid()) {
    return axios({
      url: `${URL().BASE_URL}/getToken`,
      method: 'post',
    }).then((token) => {
      // console.log('-------------token------------', token)
      AuthStorage.setToken(token.data);

      return AuthStorage.getToken();
    });
  }

  return AuthStorage.getToken();
};

export default async function request({ url, options }) {
  const params = get(options, 'params', {});
  const method = get(options, 'method', 'GET').toUpperCase();
  const body = get(options, 'body', {});
  let headers = get(options, 'headers', {});
  let urlPath = '';
  if (typeof window !== 'undefined') {
    // detect locale
    const locale = detectLanguage(window.location.href)
    headers['Accept-Language'] = locale

    const key = Object.keys(URL()).find(x => url.includes(URL()[x]));
    urlPath = url.replace(URL().MOCK_URL, `${URL().BASE_URL}/${key}`);

    const { accessToken } = await getAccessToken();
    headers = { Authorization: `bearer ${accessToken}`, ...headers };
  } else {
    const key = Object.keys(URL()).find(x => url.includes(URL()[x]));

    if (key) {
      urlPath = `${URL().BASE_URL}/${key}${url.replace(URL()[key], '')}`;
    } else {
      return;
    }
  }
  urlPath += !isEmpty(params) ? `?${qs.stringify(params)}` : '';
  let optionsFinal = {
    url: urlPath,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (isEqual(method, 'POST') || isEqual(method, 'PUT')) {
    let qsBody = {};
    if (optionsFinal.headers['Content-Type'] === 'application/json') {
      qsBody = JSON.stringify(body);
    } else {
      qsBody = qs.stringify(body);
    }

    optionsFinal = {
      ...optionsFinal,
      data: qsBody,
    };
  }
  // console.log('--------------optionsFinal---------------', optionsFinal)
  // eslint-disable-next-line consistent-return
  return axios(optionsFinal)
    .then(result => result.data)
    .catch((error) => {
      // console.log('axios error', error);
      // @TODO check error on Client middleware
      throw error;
    });

  // const source = CancelToken.source()
  // const f = axios(url, { ...options, cancelToken: source.token }).
  // then(checkStatus).then(parseJSON);
  //
  // f[CANCEL] = () => source.cancel()
  // return f
}
