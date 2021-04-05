export default class Cast {
  constructor({ id, name, profile_path, character }) {
    this.id = id;
    this.name = name;
    this.profile_path = "http://image.tmdb.org/t/p/w342//" + profile_path;
    this.character = character;
  }
}
