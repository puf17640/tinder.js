import http from '../http'
import { TopArtist, Track } from './Spotify'

type RawSpotifyTrack = {
  id: string
  name: string
  selected: boolean
  top_track: unknown
}

type IncomingUser = {
  common_friends: any[]
  common_friend_count: number
  spotify_top_artists?: RawSpotifyTrack[]
  spotify_theme_track?: {
    id: string
    name: string
    album: {
      id: string
      name: string
      images: any[]
    }
    artists: any[]
    preview_url: string
    uri: string
  }
  distance_mi: number
  connection_count: number
  common_connections: any[]
  bio: string
  birth_date: Date
  name: string
  is_travelling: boolean
  jobs: any[]
  schools: any[]
  teasers: any[]
  gender: number
  birth_date_info: string
  ping_time: Date
  badges: any[]
  photos: any[]
  common_likes: any[]
  common_like_count: number
  city?: { name?: string }
  common_interests: any[]
  s_number: number
  _id: string
  is_tinder_u: boolean
}

export default class User {
  id: string

  name: string

  birthdate: Date

  age: number

  bio: string

  distance: number

  photos: string[]

  instagram: any

  themeTrack: Track | undefined

  topArtists: TopArtist[] | undefined

  /**
   * @constructor
   * @param {user} user
   * @description Returns a new User Object
   */
  constructor(user: IncomingUser) {
    this.id = user._id
    this.name = user.name.trim()
    this.birthdate = new Date(user.birth_date)
    this.age = new Date().getFullYear() - this.birthdate.getFullYear()
    this.bio = user.bio.trim()
    this.distance = user.distance_mi
    this.photos = user.photos.map((photo: any) => photo.url)
    if (user.spotify_theme_track) this.themeTrack = new Track(user.spotify_theme_track)
    if (user.spotify_top_artists) this.topArtists = user.spotify_top_artists?.map((artist: any) => new TopArtist(artist))
  }

  /**
   * @method distanceMi
   * @memberof User
   * @description Returns the distance in miles
   * @returns {Number} - distance(in KM)
   */
  get distanceMi() {
    return this.distance
  }

  /**
   * @method distanceKm
   * @memberof User
   * @description Returns the distance in kilometers
   * @returns {Number} - distance
   */
  get distanceKm() {
    return this.distance * 1.609344
  }

  /**
   * @method like
   * @memberof User
   * @description Like the user at hand
   */
  async like() {
    await http.get(`/like/${this.id}`)
  }

  /**
   * @method dislike
   * @memberof User
   * @description Dislike the User at hand
   */
  async dislike() {
    await http.get(`/pass/${this.id}`)
  }

  /**
   * @method superlike
   * @memberof User
   * @description Superlike the user at hand
   */
  async superlike() {
    await http.get(`/like/${this.id}/super`)
  }
}
