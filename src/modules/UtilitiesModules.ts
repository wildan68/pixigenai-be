export default class UtilitiesModules {
  buildQuery (query: any) {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  }
}