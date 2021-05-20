/* eslint-disable max-classes-per-file */

class InstagramPhoto {
  image: any

  thumbnail: any

  ts: any

  constructor(photo: { image: any; thumbnail: any; ts: any }) {
    this.image = photo.image
    this.thumbnail = photo.thumbnail
    this.ts = photo.ts
  }
}

export default class InstagramInfo {
  lastFetch: Date

  completedInitialFetch: any

  mediaCount: number

  photos?: any[]

  constructor(info: { last_fetch_time: string | number | Date; completed_initial_fetch: any; media_count: number; photos: any[] }) {
    this.lastFetch = new Date(info.last_fetch_time)
    this.completedInitialFetch = info.completed_initial_fetch
    this.mediaCount = info.media_count
    if (info.photos) this.photos = info.photos.map((photo) => new InstagramPhoto(photo))
  }
}
