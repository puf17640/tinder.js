/* eslint-disable no-param-reassign */
import centra from '@aero/centra'

const baseUrl = 'https://api.gotinder.com'

const headers = {
  'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
  Accept: 'application/json',
  'X-Auth-Token': '',
}

function setToken(authToken: AuthToken) {
  headers['X-Auth-Token'] = authToken
}

const req = async (route: string, method?: string, body?: any): Promise<any> => {
  route = baseUrl + route
  const fetch = centra(route, method)
  fetch.reqHeaders = headers
  const res = await fetch.body(body).send()
  if (res.statusCode >= 200 && res.statusCode < 300) {
    try {
      return res.json
    } catch {
      return { status: res.statusCode }
    }
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    throw res.text
  } else {
    // eslint-disable-next-line no-console
    console.log(`reattempting, status code: ${res.statusCode}`)
    return req(route, method, body)
  }
}

const get = (route: string): Promise<any> => req(route)

const post = (route: string, body?: any): Promise<any> => req(route, 'POST', body)

const put = async (route: string, body: any): Promise<any> => req(route, 'PUT', body)

const del = (route: string): Promise<any> => req(route, 'DELETE')

export default {
  setToken,
  get,
  post,
  put,
  delete: del,
}
