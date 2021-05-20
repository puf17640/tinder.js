export default class Profile {
  id: any;

  ageMax: any;

  ageMin: any;

  bio: any;

  birthdate: Date;

  created: Date;

  discoverable: any;

  distanceFilter: any;

  email: any;

  gender: any;

  genderFilter: any;

  name: any;

  photos: any;

  showGender: any;

  canCreateSquad: any;

  position: any;

  constructor(profile: {
    _id: any;
    age_filter_max: any;
    age_filter_min: any;
    bio: any;
    birth_date: string | number | Date;
    create_date: string | number | Date;
    discoverable: any;
    distance_filter: any;
    email: any;
    gender: any;
    gender_filter: any;
    name: any;
    photos: any[];
    show_gender_on_profile: any;
    can_create_squad: any;
    pos: any;
  }) {
    this.id = profile._id;
    this.ageMax = profile.age_filter_max;
    this.ageMin = profile.age_filter_min;
    this.bio = profile.bio;
    this.birthdate = new Date(profile.birth_date);
    this.created = new Date(profile.create_date);
    this.discoverable = profile.discoverable;
    this.distanceFilter = profile.distance_filter;
    this.email = profile.email;
    this.gender = profile.gender;
    this.genderFilter = profile.gender_filter;
    this.name = profile.name;
    if (profile.photos) this.photos = profile.photos.map((photo) => photo.url);
    this.showGender = profile.show_gender_on_profile;
    this.canCreateSquad = profile.can_create_squad;
    this.position = profile.pos;
  }
}
