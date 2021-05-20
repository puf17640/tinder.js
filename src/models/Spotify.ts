/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line max-classes-per-file
export class TopArtist {
  artistId: any

  name: any

  selected: any

  topTrack: Track

  constructor(artist: any) {
    this.artistId = artist.id
    this.name = artist.name
    this.selected = artist.selected
    this.topTrack = new Track(artist.top_track)
  }
}

export class Track {
  trackId: any

  name: any

  album: Album

  previewUrl: any

  uri: any

  constructor(track: any) {
    this.trackId = track.id
    this.name = track.name
    this.album = new Album(track.album)
    this.previewUrl = track.preview_url
    this.uri = track.uri
  }
}

class Album {
  albumId: any

  name: any

  images: { [k: string]: any }

  constructor(album: {
    id: any
    name: any
    images: {
      map: (arg0: (image: any) => any[]) => Iterable<readonly [PropertyKey, any]>
    }
  }) {
    this.albumId = album.id
    this.name = album.name
    this.images = Object.fromEntries(album.images.map((image) => [image.height, image.url]))
  }

  getImageUrl(resolution = 640) {
    return this.images[resolution]
  }
}
