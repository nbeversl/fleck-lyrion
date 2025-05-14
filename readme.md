# Fleck Theme for Lyrion Media Server

This theme brings the speed, extensibility, and usability of a modern single-page app to the legacy of Logitech's beloved open source media server.

Though LMS is feature rich with many contributed extensions, it is also appealing for its **stability**.

This theme is for users who:

- Like album art and mostly want to view their library as near as possible to a collection of discs. In track view, each track listing provides access to its full album in a single click.
- Want the option of a simple and elegant library browser with controls minimal or hidden. The many other features remain accessible through the default or any other theme desired.
- Want as few clicks/taps as possible to access library and playback

[Lyrion Music Server](https://lyrion.org/) (formerly Logitech Media Server) began as a server for Squeezebox and [Slim Devices](https://en.wikipedia.org/wiki/Squeezebox_(network_music_player)) and was made [open source](https://github.com/LMS-Community) when these devices were discontinued. It remains a widely used alternative to commercially licensed media servers.

## Demo

A live demo is at https://fleck-theme.org/. Note the demo does not play music and no audio files are hosted there.

## Features

- Remote controls all LMS players on the network
- Plays to the client device via the browser
- Search bar results consolidate **all** capabilities of the LMS API, searching tracks, artists, and albums in a single step
- Control bar can be hidden entirely for fullscreen browsing view
- Resizable album grid
- View albums alphabetically or shuffled
- Random album grid on load and on a single click/tap
- Track views in search results provide access to the source album in a single click/tap
- Downloads tracks to the client device
- Light and dark modes
- CSS is not prebuilt; you can modify the styling by modifying the CSS
- Optimized for small screens (mobile)

## Installation

Download or clone this respository and put the folder into the HTML directory of your LMS server with the name `fleck-theme`. 

The folder location will depend on your operating system. See this page for full information: http://wiki.slimdevices.com/index.php/Logitech_Media_Server_file_locations

In the settings panel of the Default web interface under Interface, choose Web Interface: fleck-theme.

To access the Default theme at any time, go to /Default

## Issues

Post issues at https://github.com/nbeversl/fleck-theme/issues
