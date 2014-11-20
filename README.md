Service Map Prototype
=====================

This is a visual prototype for the BYU-Idaho Service Map. This map's purpose is to make it easier to find and access services across campus. Whether that service is available online or in person, each entry should make clear how the student can contact the department in charge of the service and begin to take advantage of what it has to offer.

## Angular Prototype ##

This high-fidelity prototype is built on Angular.js, and uses a static JSON file for data. The ideal implementation of this app will probably use a more dynamic data delivery method and a JavaScript library (or vanilla JS) better suited to the app.

## Live Preview ##

A live preview of the more recent versions of this prototype can be viewed at: <http://byui-web.github.io/service-map/>

## Grunt ##

There are 5 different grunt tasks available

**default** - 
This task should be run before pushing to submit a pull request.  This task will do 3 primary things:

* Minify Javascript and CSS
* Compile layout.html and app.html into index.html
* Do a build for ingeniux (See ingeniux task to see what this does)

**dev** - 
This task should be run while doing development.  This task will do 3 primary things:

* Beautify your source files so that while doing development, debugging can be easier
* Start a webserver to go to `localhost:5100`
* Watch your files to automatically rerun tasks when files change and livereload

**prod-test** -
This should be used before pushing and submitting a pull request. It is used to test your code after minification to ensure proper functionality. This is especially important since this runs on angular. This task will do 2 primary things:

* Everything the **default** task does
* Start a webserver to go to `localhost:5100`

**ingeniux** - 
Prepares the necessary files that need to go into ingeniux to work there.  They are all stored in the ingeniux directory after the task finishes. This task shouldn't be used often because the default task will run this task for you.  This task will do 3 primary things: 
    
* Copy all of the necessary files to put in Ingeniux into the ingeniux directory
* Prep the app.html file by appending the necessary script and css includes
* replace the url for retreiving the service data to the location in Ingeniux assets

**gh-pages** - 
Will publish the contents of your current branch to gh-pages on github.  This should only be done from the master branch so that gh-pages stays in sync with what is in master
