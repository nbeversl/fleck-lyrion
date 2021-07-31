# Boulez frontend of Logitech Media Server

This repository contains the source code for the Boulez frontend for Logitech Media Server. It is written in React using MaterialUI. Howl.js enables this app to stream directly to the browser in addition to the zones of the media server. An abstraction of Logitech's server and library API is embedded.

For a ready-made theme with code prebuilt, bootstrapped and ready to run, instead download https://github.com/nbeversl/lms-boulez-theme.

## Contents:

This repository is under active development. Post issues at https://github.com/nbeversl/lms-boulez/issues. 
Files are in `.jsx` for future but do not currently utilitize Typescript.

### Components:

- AlbumGrid: Responsive grid of interactive album art with adjustable size
- Album: Single album
- AlbumList: Album art with embedded TrackList
- App: The app.
- BPMView : Lists individual tracks by BPM (see https://wiki.xwax.org/bpm-tools for how to add this to the library)
- BrowserPlayer: Add-on component that uses Howl.js to stream directly to the browser.
- Composer: Organize albums by composer
- ComposerList: Show results by Composer/Artist
- GenreMenu: Hub component that displays server contents and genre and delegates the view by selection.
- ViewSelector: Used in GenreMenu to select the current view
- Library: An abstraction of Logitech's library API to JavaScript.
- Player: An abstraction of Logitech's player API to JavaScript
- PlayerControls: Player controls used in Player.
- PlayerSelector: Selects from available zones, plus the browser option.
- Search: Search bar component
- SearchResults: Display results from Search
- TrackList: Lists tracks.
- TrackListScrolling: Displays tracks in a scrolling view.
- TrackWithSourceAlbum: Display a single track with a full Album component embedded for reference.
- TrackWithDetails: (incomplete) Show track metadata.

### Other files

- server.jsx : Abstracts calls to LMS's jsonrpc API so they are more usable.
- style.css : Currently bundled with the build.

## Development

Clone the repository.

A `webpack.config.js` is provided, but you have to populate `module.exports.output.path`. For example, if you install the complete theme on your server (https://github.com/nbeversl/lms-boulez-theme), you can direct development builds directly to overrwrite `main.js` for testing. You can also bootstrap it yourself if you want to build a theme from scratch.

run `npm install`


