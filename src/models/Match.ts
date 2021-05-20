/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import Message from './Message'
import User from './User'
import http from '../http'
import Person from './Person'
import { CacheManager } from '../cache'

export default class Match {
  seen?: { match_seen: boolean; last_msg_seen: string }

  id: string

  closed: boolean

  commonFriendCount: number

  commonLikeCount: number

  created: Date

  dead: boolean

  lastActivity: Date

  pending: boolean

  isSuperlike: boolean

  isBoostMatch: boolean

  isSuperBoostMatch: boolean

  isExperiencesMatch: boolean

  isFastMatch: boolean

  isOpener: boolean

  person: Person

  messageCount: number

  private cache: CacheManager

  constructor(match: any, cache: CacheManager) {
    this.cache = cache

    this.seen = match.seen
    this.id = match.id
    this.closed = match.closed
    this.commonFriendCount = match.common_friend_count
    this.commonLikeCount = match.common_like_count
    this.created = new Date(match.created_date)
    this.dead = match.dead
    this.person = new Person(match.person)
    this.lastActivity = new Date(match.last_activity_date)
    this.pending = match.pending
    this.isSuperlike = match.is_super_like
    this.isBoostMatch = match.is_boost_match
    this.isSuperBoostMatch = match.is_super_boost_match
    this.isExperiencesMatch = match.is_experiences_match
    this.isFastMatch = match.is_fast_match
    this.isOpener = match.is_opener
    this.messageCount = match.message_count
  }

  /**
   * @returns the tinder userobject
   */
  async getUser(): Promise<User> {
    const res = await http.get(`/user/${this.person.id}`)
    return new User(res.results)
  }

  /**
   * @param content of the message to send
   */
  async sendMessage(content: string) {
    const res = await http.post(`/user/matches/${this.id}`, {
      message: content,
    })

    return new Message(res.results, this.cache)
  }

  /**
   * @param {Number} [count=60] - Number of messages you want to request from the tinder API
   * @param {*} pageToken - Page token
   */
  async getMessages(count: number = 60, pageToken: any) {
    const cacheAndForget = (message: any) => {
      if (!this.cache.has(message.id)) this.cache.set(message.id, message)
      return new Message(message, this.cache)
    }
    let res = await http.get(`/v2/matches/${this.id}/messages?count=${count}${pageToken ? `&page_token=${pageToken}` : ''}`)
    const messages = res.data.messages.map((message: any) => cacheAndForget(message))
    if (count > 60) {
      while (messages.count < count) {
        res = await http.get(`/v2/matches/${this.id}/messages?count=${count}&page_token=${res.page_token}`)
        messages.push(res.data.messages.map((message: any) => cacheAndForget(message)))
      }
    }
    return messages.splice(0, count)
  }

  /**
   * use this method to unmatch the current match
   */
  async unmatch() {
    await http.delete(`/user/matches/${this.id}`)
  }
}
