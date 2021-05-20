/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TopArtist, Track } from './Spotify'
import InstagramInfo from './Instagram'
import FacebookInfo from './Facebook'
import http from '../http'

export default class Swipe {
  // can be of type 'user'
  type: string

  rec_type: any

  userId: any

  name: any

  birthdate: Date

  age: number

  bio: string

  badges: any

  distance: any

  photos: any

  gender: any

  jobs: any

  schools: any

  showGender: boolean

  facebook: FacebookInfo

  isSuperlikeUpsell: boolean

  contentHash: any

  teasers: any

  spotifyConntected: boolean

  spotify:
    | {
        connected: boolean
        spotifyTopArtists: TopArtist[]
        spotifyThemeTrack: Track | undefined
      }
    | undefined

  instagram: InstagramInfo | undefined

  traveling: any

  sexualOrientations: any

  experimental: any

  hideage: any

  hideDistance: any

  // swipe.is_superlike_upsell;

  recentlyActive: boolean
  // - swipe.user.recently_active

  /**
   * @typedef {*} swipe
   *
   * @memberof Swipe
   *
   * @property {*} userId - Tinder User ID of the swipe
   * @property {String} name - Name or Username of the swipe
   * @property {Date} birthdate - Birthdate as Date Object
   * @property {Number} age
   * @property {String} bio
   * @property {Array} badges
   * @property {Number} distance - Distance in miles
   * @property {String[]} photos - Array of links to the photo(s)
   * @property {Number} gender - Gender, 1 = female
   * @property {Array} jobs
   * @property {Array} schools
   * @property {Boolean} schowGender
   * @property {Object} facebook
   * @property {Object} spotify
   * @property {Object} instagram
   * @property {Boolean} traveling - Is true when the other user has the passport feature is and is currently traveling
   * @property {String} contentHash
   * @property {Object} teasers - The little teasers that are shown on the bottom above the photos when your are swiping (on the mobile app)
   * @property {Object} experimental - Experimental information. Currently theres a property under "experimental.user_interests" that called "selected_interests" that will show you
   * the interests picked by the user.
   *
   * deprecated: isSuperlikeUpsell - swipe.is_superlike_upsell; recentlyActive - swipe.user.recently_active
   *
   */

  /**
   * @constructor
   * @param {Object} swipe - The raw swipe object we get from tinder
   * @description Returns a new Swipe object
   */
  constructor(swipe: any) {
    this.type = swipe.type
    // rec_type = user, newbie_promotion, boost, sprinkle?, reactivated_2 (shit dude)
    this.rec_type = swipe.rec_type
    this.userId = swipe.user._id
    this.name = swipe.user.name
    this.birthdate = new Date(swipe.user.birth_date)
    this.age = new Date().getFullYear() - this.birthdate.getFullYear()
    this.bio = swipe.user.bio.trim()
    this.badges = swipe.user.badges
    this.distance = swipe.distance_mi
    this.photos = swipe.user.photos.map((photo: { url: string }) => photo.url)
    this.gender = swipe.user.gender
    this.jobs = swipe.user.jobs
    this.schools = swipe.user.schools
    this.showGender = swipe.user.show_gender_on_profile
    this.facebook = new FacebookInfo(swipe.facebook)
    this.isSuperlikeUpsell = swipe.is_superlike_upsell
    this.contentHash = swipe.content_hash
    this.teasers = swipe.teasers
    this.recentlyActive = swipe.user.recently_active
    this.spotifyConntected = swipe.spotify.spotify_connected ?? false
    if (this.spotifyConntected) {
      this.spotify = {
        connected: swipe.spotify.spotify_connected,
        spotifyTopArtists: swipe.spotify.spotify_top_artists?.map((artist: any) => new TopArtist(artist)),
        spotifyThemeTrack: swipe.spotify.spotify_theme_track ? new Track(swipe.spotify.spotify_theme_track) : undefined,
      }
    }
    if (swipe.instagram) this.instagram = new InstagramInfo(swipe.instagram)
    if (swipe.is_traveling) this.traveling = swipe.is_traveling
    if (swipe.user.sexual_orientations) this.sexualOrientations = swipe.user.sexual_orientations
    if (swipe.experiment_info) this.experimental = swipe.experiment_info
    if (swipe.hide_age) this.hideage = swipe.hide_age
    if (swipe.hide_distance) this.hideDistance = swipe.hide_distance
  }

  /**
   * @method distanceMi
   * @memberof Swipe
   * @description Returns the distance in miles
   * @returns {Number} - distance
   */
  get distanceMi() {
    return this.distance
  }

  /**
   * @method distanceKm
   * @memberof Swipe
   * @description Returns the distance in kilometers
   * @returns {Number} - distance(in KM)
   */
  get distanceKm() {
    return this.distance * 1.609344
  }

  /**
   * @async
   * @method like
   * @memberof Swipe
   * @description Like the swipe at hand
   */
  async like() {
    await http.get(`/like/${this.userId}`)
  }

  /**
   * @async
   * @method dislike
   * @memberof Swipe
   * @description Dislike or pass the currrent swipe
   */
  async dislike() {
    await http.get(`/pass/${this.userId}`)
  }

  /**
   * @async
   * @method superlike
   * @memberof Swipe
   * @description Superlike the swipe at hand
   */
  async superlike() {
    await http.get(`/like/${this.userId}/super`)
  }
}
