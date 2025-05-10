# Boulez frontend for Logitech Media Server

This repository contains the source code for the Boulez frontend for Logitech Media Server. It is written in React. An abstraction of Logitech's server and library API is embedded.

For a ready-made theme with built code ready to run, download instead https://github.com/nbeversl/lms-boulez-theme.

## Issues

Post issues at https://github.com/nbeversl/lms-boulez/issues. 

## Development

Clone the repository.

A `webpack.config.js` is provided, but you have to populate `module.exports.output.path`. For example, if you install the complete theme on your server (https://github.com/nbeversl/lms-boulez-theme), you can direct development builds directly to overrwrite `main.js` for testing. You can also bootstrap it yourself if you want to build a theme from scratch.

run `npm install`
