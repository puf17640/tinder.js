export default class Person {
  id: string

  bio: string

  gender: number

  name: string

  pingTime: Date

  photos: any[]

  constructor(person: { _id: string; bio: string; gender: number; name: string; ping_time: string | number | Date; photos: any[] }) {
    this.id = person._id
    this.bio = person.bio
    this.gender = person.gender
    this.name = person.name
    this.pingTime = new Date(person.ping_time)
    this.photos = person.photos
  }
}
