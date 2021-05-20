/* eslint-disable import/no-cycle */
import User from './User'
import Match from './Match'
import http from '../http'
import { CacheManager } from '../cache'

export default class Message {
  id: string

  matchId: string

  sent: string | Date

  content: any

  receiverId: string

  senderId: string

  timestamp: any

  created: string | Date

  isLiked: boolean

  private cache: CacheManager

  constructor(
    message: { _id: any; match_id: any; sent_date: string | number | Date; message: any; to: any; from: any; timestamp: string; created_date: string | number | Date; is_liked: any },
    cache: CacheManager,
  ) {
    this.cache = cache

    this.id = message._id
    this.matchId = message.match_id
    this.sent = message.sent_date ? new Date(message.sent_date) : 'N/A'
    this.content = message.message
    this.receiverId = message.to
    this.senderId = message.from
    this.timestamp = message.timestamp ?? 'N/A'
    this.created = message.created_date ? new Date(message.created_date) : 'N/A'
    this.isLiked = !!message.is_liked
  }

  /**
   * @returns the userobject of the message author
   */
  async getAuthor(): Promise<User> {
    if (this.cache.has(this.senderId)) return new User(this.cache.get(this.senderId))
    const res = await http.get(`/user/${this.senderId}`)
    this.cache.set(this.senderId, res.results)
    return new User(res.results)
  }

  /**
   * @returns the match in which context the message was sent
   */
  async getMatch(): Promise<Match> {
    if (this.cache.has(this.matchId)) return new Match(this.cache.get(this.matchId), this.cache)
    const res = await http.get(`/v2/matches/${this.matchId}`)
    this.cache.set(this.matchId, res.data)
    return new Match(res.data, this.cache)
  }

  /**
   * like the given message
   */
  async like() {
    return http.post(`/message/${this.id}/like`)
  }

  /**
   * dislike the given message
   */
  async dislike() {
    return http.delete(`/message/${this.id}/like`)
  }
}
