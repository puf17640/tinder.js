/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import http from './http'
import { CacheManager } from './cache'
import { User, Message, Match, Profile, Swipe } from './models'
import UserCache from "./cache/UserCache";

export class Tinder {
  private readonly cache: CacheManager

  constructor(authToken: AuthToken, options?: { maxItems?: number, maxAge?: number, cache?: typeof UserCache }) {
    http.setToken(authToken)
    this.cache = new CacheManager(options)
  }

  /**
   * Use this method to tell the tinder api you are back and want the latest upates
   * @param date The date from where on you want to get updates
   * @returns all updates since the specified date
   */
  async getUpdatesSince(date: Date) {
    // eslint-disable-next-line camelcase
    return http.post('/updates', {
      last_activity_date: date.toISOString(),
    })
  }

  /**
   * @returns your swipes from the tinder api
   */
  async getSwipes(): Promise<Swipe[]> {
    const swipes = await http.get('/v2/recs/core')

    swipes.data.results.forEach((res: any) => {
      console.log(res)
    })
    return swipes.data.results.map((swipe: any) => new Swipe(swipe))
  }

  async getMeta() {
    const meta = await http.get('/v2/meta')
    return meta.data
  }

  /**
   * This method is used to report users by id
   * @param id - id of the user to report
   * @param cause - reason why you want to report the user
   * @param explanation - explanation of the report
   */
  async reportUser(id: string | any[], cause: any, explanation: any) {
    if (id && id.length > 0) await http.post(`/report/${id}`, { cause, explanation })
  }

  /**
   * This method resets your username
   */
  async resetUsername() {
    return this.changeUsername()
  }

  /**
   * Change your username
   * @param username - the new username you want to use from now on
   */
  async changeUsername(username?: string): Promise<void> {
    if (username && username.length > 0) await http.put('/profile/username', { username })
    else await http.delete('/profile/username')
  }

  async travelToLocation(lat: string | number, lon: string | number): Promise<void> {
    await http.post('/passport/user/travel', { lat, lon })
  }

  async changeLocation(lat: string | number, lon: string | number): Promise<void> {
    await http.post('/user/ping', { lat, lon })
  }

  async resetLocation(): Promise<void> {
    await http.post('/passport/user/reset')
  }

  /**
   * @returns the total amount of likes you received
   */
  async getLikeCount(): Promise<number> {
    const res = await http.get('/v2/fast-match/count')
    return res.data.count
  }

  async changePreferences(ageFilterMin: any, ageFilterMax: any, genderFilter: any, gender: any, distanceFilter: any): Promise<Profile> {
    const res = await http.post('/v2/profile', {
      user: Object.fromEntries(
        Object.entries({
          ageFilterMin,
          ageFilterMax,
          genderFilter,
          gender,
          distanceFilter,
        })
          .filter(([, val]) => Number.isInteger(val) || val === false || val === true)
          .map(([key, val]) => [key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(), val]),
      ),
    })
    return new Profile(res.data.user)
  }

  async getProfile(): Promise<Profile> {
    return new Profile(await http.get('/profile'))
  }

  async getRecommendedUsers(): Promise<User[]> {
    const res = await http.get('/user/recs')
    return res.results.map((rec: any) => {
      this.cache.set(rec._id, rec)
      return new User(rec)
    })
  }

  /**
   * This method is used to obtain all your matches from the tinder api
   * @param count How many matches you want to get returned
   * @param pageToken - pagetoken
   * @returns an array with all your matches as match objects
   */
  async getMatches(count: number = 60, pageToken?: any): Promise<Match[]> {
    let res = await http.get(`/v2/matches?count=${count}&is_tinder_u=false${pageToken ? `&page_token=${pageToken}` : ''}`)
    const matches = res.data.matches.map((match: any) => {
      this.cache.set(match.id, match)
      return new Match(match, this.cache)
    })
    if (matches.count < count && res.page_token) {
      while (matches.count < count) {
        // eslint-disable-next-line no-await-in-loop
        res = await http.get(`/v2/matches?count=${count}&page_token=${res.page_token}`)
        matches.push(
          res.data.matches.map((match: any) => {
            this.cache.set(match.id, match)
            return new Match(match, this.cache)
          }),
        )
      }
    }
    return matches.splice(0, count)
  }

  /**
   * This method is used to fetch a specific metch from the tinder api by id
   * @param id Id of the match you want to fetch
   * @returns a tinder match object with the given id
   */
  async getMatch(id: string): Promise<Match | undefined> {
    if (id && id.length > 0) {
      if (this.cache.has(id)) return new Match(this.cache.get(id), this.cache)
      const rawMatch = (await http.get(`/v2/matches/${id}`)).data
      this.cache.set(id, rawMatch)
      return new Match(rawMatch, this.cache)
    }
    return undefined
  }

  async getMatchesByName(name: string): Promise<Match[]> {
    const matches = await this.getMatches()
    const matchesWithName = await Promise.all(matches.map(async (match: { getUser: () => any }) => [(await match.getUser()).name, match]))
    return (
      matchesWithName
        // @ts-ignore
        .filter(([username]) => username === name)
        // @ts-ignore
        .map(([, match]) => match)
    )
  }

  /**
   * This method is used to fetch a specific user from the tinder api
   * @param id Id of the user you want to fetch
   * @returns a tinder user object
   */
  async getUser(id: string): Promise<User | undefined> {
    const rawUser = (await http.get(`/user/${id}`)).results
    console.log(rawUser)
    rawUser.spotify_top_artists.forEach((artist: any) => console.log(artist))
    if (id && id.length > 0) {
      if (this.cache.has(id)) return new User(this.cache.get(id))
      this.cache.set(id, rawUser)
      return new User(rawUser)
    }
    return undefined
  }

  /**
   * This method is used to fetch a specific message from the api
   * @param id Id of the message you want to fetch
   * @returns a tinder message object
   */
  async getMessage(id: string): Promise<Message | undefined> {
    if (id && id.length > 0) {
      if (this.cache.has(id)) return new Message(this.cache.get(id), this.cache)
      const rawMsg = await http.get(`/message/${id}`)
      this.cache.set(id, rawMsg)
      return new Message(rawMsg, this.cache)
    }
    return undefined
  }
}
