const tags = {
  "**A**": "**A**", // For every artist role (one of "artist", "composer", "conductor", "band", "albumartist" or "trackartist"), a comma separated list of names.
  buttons: "**B**", // , // A hash with button definitions. Only available for certain plugins such as Pandora.
  coverid: "**c**", // , // coverid to use when constructing an artwork URL, such as /music/$coverid/cover.jpg
  compilation: "**C**", // , //  1 if the album this track belongs to is a compilation
  duration: "**d**", // , // Song duration in seconds.
  album_id: "**e**", // , // Album ID. Only if known.
  filesize: "**f**", // , // Song file length in bytes. Only if known.
  genre: "**g**", // , // Genre name. Only if known.
  genres: "**G**", // , // Genre names, separated by commas (only useful if the server is set to handle multiple items in tags).
  disc: "**i**", //  Disc number. Only if known.
  samplesize: "**I**", //  Song sample size (in bits)
  coverart: "**j**", //  1 if coverart is available for this song. Not listed otherwise.
  artwork_track_id: "**J**", //  	Identifier of the album track used by the server to display the album's artwork. Not listed if artwork is not available for this album.
  comment: "**k**", //  Song comments, if any.
  artwork_url: "**K**", //  A full URL to remote artwork. Only available for certain plugins such as Pandora and Rhapsody.
  album: "**l**", //  Album name. Only if known.
  info_link: "**L**", //  A custom link to use for trackinfo. Only available for certain plugins such as Pandora.
  bpm: "**m**", //  Beats per minute. Only if known.
  musicmagic_mixable: "**M**", //	 1 if track is mixable, otherwise 0.
  modificationTime: "**n**", //  Date and time song file was last changed.
  remote_title: "**N**", //  Title of the internet radio station.
  type: "**o**", //  Content type. Only if known.
  genre_id: "**p**", //  Genre ID. Only if known.
  genre_ids: "**P**", //  Genre IDs, separated by commas (only useful if the server is set to handle multiple items in tags).
  disccount: "**q**", //  Number of discs. Only if known.
  bitrate: "**r**", //  Song bitrate. Only if known.
  rating: "**R**", //  Song rating, if known and greater than 0.
  artist_id: "**s**", //  Artist ID.
  _ids: "**S**", //  For each role as defined above, the list of ids.
  tracknum: "**t**", //  Track number. Only if known.
  samplerate: "**T**", //  Song sample rate (in KHz)
  url: "**u**", //  Song file url.
  tagversion: "**v**", //  Version of tag information in song file. Only if known.
  lyrics: "**w**", //  Lyrics. Only if known.
  remote: "**x**", //  If 1, this is a remote track.
  album_replay_gain: "**X**", //  '	Replay gain of the album (in dB), if any
  year: "**y**", //  Song year. Only if known.
  replay_gain: "**Y**", //  Replay gain (in dB), if any
};

export default tags;
