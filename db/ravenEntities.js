// Since document entities are most conveniently inserted as class instances,
// create class defs for different collections

// NOTE: pkey constructors below correspond to primary key id fields in SQL databases. The
// 'id' field in RavenDB is auto-generated, and shared amongst these 3 collections,
// and thus can't be efficiently used for indexing or querying.
const Description = function(pkey, title, description) {
  this.id = `descriptions/${pkey}`;
  this.title = title;
  this.description = description;
}
exports.Description = Description;

const Genre = function(pkey, name) {
  this.id = `genres/${pkey}`;
  this.name = name;
}
exports.Genre = Genre;

const GameGenre = function(pkey, product_id, genre_id) {
  this.id = `gameGenres/${pkey}`;
  this.product_id = product_id;
  this.genre_id = genre_id;
}
exports.GameGenre = GameGenre;
