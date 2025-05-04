const tags = {
  
  // For every artist role (one of "artist", "composer", "conductor", "band", "albumartist" or "trackartist"), a comma separated list of names.
  "**A**": "**A**", 
  
  // A hash with button definitions. Only available for certain plugins such as Pandora.
  buttons: "**B**", 
  
  // coverid to use when constructing an artwork URL, such as /music/$coverid/cover.jpg
  coverid: "**c**", 
  
  // 1 if the album this track belongs to is a compilation
  compilation: "**C**", 

  // Song duration in seconds.
  duration: "**d**", 

  // Album ID. Only if known.
  album_id: "**e**", 

  // Song file length in bytes. Only if known.
  filesize: "**f**", 

  // Genre name. Only if known.
  genre: "**g**",

  // Genre names, separated by commas (only useful if the server is set to handle multiple items in tags).
  genres: "**G**", 

  // Disc number. Only if known.
  disc: "**i**", 

  //  Song sample size (in bits)
  samplesize: "**I**", 

  //  1 if coverart is available for this song. Not listed otherwise.
  coverart: "**j**", 

  // Identifier of the album track used by the server to display the album's artwork. Not listed if artwork is not available for this album.
  artwork_track_id: "**J**", 

  //  Song comments, if any.
  comment: "**k**", 

  //  A full URL to remote artwork. Only available for certain plugins such as Pandora and Rhapsody.
  artwork_url: "**K**", 

  //  Album name. Only if known.
  album: "**l**", 

  //  A custom link to use for trackinfo. Only available for certain plugins such as Pandora.
  info_link: "**L**", 

  //  Beats per minute. Only if known.
  bpm: "**m**", 

  //   1 if track is mixable, otherwise 0.
  musicmagic_mixable: "**M**", 

  //  Date and time song file was last changed.
  modificationTime: "**n**",

  //  Title of the internet radio station.
  remote_title: "**N**", 

  //  Content type. Only if known.
  type: "**o**", 
  

  //  Genre ID. Only if known.
  genre_id: "**p**",

  //  Genre IDs, separated by commas (only useful if the server is set to handle multiple items in tags).
  genre_ids: "**P**", 

  //  Number of discs. Only if known.
  disccount: "**q**", 

  //  Song bitrate. Only if known.
  bitrate: "**r**", 

  //  Song rating, if known and greater than 0.
  rating: "**R**", 

  //  Artist ID.
  artist_id: "**s**", 

  //  For each role as defined above, the list of ids.
  _ids: "**S**", 

  //  Track number. Only if known.
  tracknum: "**t**", 

  //  Song sample rate (in KHz)
  samplerate: "**T**", 

  //  Song file url.
  url: "**u**", 

  //  Version of tag information in song file. Only if known.
  tagversion: "**v**", 
 
  // Lyrics. Only if known.
  lyrics: "**w**",

  // If 1, this is a remote track.
  remote: "**x**", 

  // Replay gain of the album (in dB), if any
  album_replay_gain: "**X**", 

  // Song year. Only if known.
  year: "**y**", 

  // Replay gain (in dB), if any
  replay_gain: "**Y**", 
};

export default tags;
