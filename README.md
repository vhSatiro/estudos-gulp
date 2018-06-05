# estudos-gulp

## Folder structure

### src
source files, pre-processed, un-minified.  

### tmp
development files, pre-processed, un-minified. The directory where you will be running the web server.  

### dist
production files, processed, minified.

#### Steps

1. Create the paths variable on gulpfile.js.
2. Create the task to copy files of each type to tmp folder using pipe(), then, combine all of then in an 'copy' function.
3. Create an injection to tell to index.html which CSS and JS files he will use, using gulp-inject.
4. Create the serve task to run the server and reload on any changes, use inject as an dependency, this will copy everything that is changed on src to tmp.
5. Create the watch task, it will use serve as an dependency, this means it will start the server and then start watching the changes on the src folder, if something is changed, it will trigger the inject task and inject the changed files. (Link the watch task as an dependency of default task, with this, we can start watching with the command 'gulp').
6. Create the tasks to minify and copy to dist ':dist' and create an 'copy:dist' to unite all of this tasks.
7. Create the build task and use the inject:dist as an dependency.
8. Add the HTMLclean tags over the comments on index.html <!--[htmlclean-protect]--> <!--[/htmlclean-protect]-->.
  


