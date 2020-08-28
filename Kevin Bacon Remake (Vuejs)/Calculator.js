//Vue Instance
var app = new Vue({
  el: '#app',
  data: {
    name: document.getElementById('usr'),
  }
})

//File I/O
let input = document.querySelector('input');
let textarea = document.querySelector('textarea');
var actorsForMovie = [];
var movies = [];
var g = new Graph();
var distances;
input.addEventListener('change', () => {
  let files = input.files;

  if(files.length == 0) return;

  const file = files[0];

  let reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    const lines = file.split("MOVIE");

    console.log(lines);
    //loading association table
    for(var i = 0; i < lines.length; i++){
      if(i % 2 != 0){
        actorsForMovie[lines[i - 1]] = lines[i].split("\/");
      } else {
        movies.push(lines[i]);
      }
    }
    //printing to console
    console.log(actorsForMovie);
    console.log(movies);

    textarea.value = lines.join("\n");
    var log = [];
    //Mapping to Graph
    for(var i = 0; i < movies.length; i++){
      g.addV(movies[i]);
      var actors = actorsForMovie[movies[i]];
      for(var j = 0; j < actors.length; j++){
        if(!log.includes(actors[j])) g.addV(actors[j]);
        log.push(actors[j]);
        g.addE(movies[i], actors[j]);
      }
    }
    distances = bfs(g, "Bacon, Kevin", movies, actorsForMovie);
    console.log(g.print());
    console.log(g.size());
    console.log(distances);


  }

  reader.onerror = (e) => alert(e.target.error.name);

  reader.readAsText(file);
});

//onscreen
function onscreen(){
  var word = document.getElementById('usr').value;
  document.getElementById('change-me').innerHTML = "Kevin Bacon Number of " + word + ": " + distances[word];
}

//Graph
function Graph() {
    this.vertices = [];
    this.edges = [];
    this.numVertices = 0;
    this.numEdges = 0;
    var statement = "";
  this.size = function(){
    return this.numVertices;
  }
  this.addV = function(vertex){
    this.vertices.push(vertex);
    this.edges[vertex] = [];
    this.numVertices++;
  }
  this.addE = function(vertex1, vertex2){
    this.edges[vertex1].push(vertex2);
    this.edges[vertex2].push(vertex1);
  }
  this.print = function() {
    this.vertices.forEach((vertex, i) => {
      statement += vertex + ": " + this.edges[vertex];
      if(i < this.vertices.length - 1) statement += "\n";
    });
    console.log(statement);
    return statement;
  }
}
//BFS
function bfs(graph, start, movies, actorsForMovie){
  var nodesDis = {};
  // for(var i = 0; i < graph.size(); i++){
  //   nodesDis[i] = Infinity;
  // }
  for(var i = 0; i < movies.length; i++){
    nodesDis[movies[i]] = Infinity;
    var actors = actorsForMovie[movies[i]];
    for(var j = 0; j < actors.length; j++){
      nodesDis[actors[j]] = Infinity;
    }
  }
  nodesDis[start] = 0;

  var queue = [start];
  var current;

  while(queue.length != 0){
    current = queue.shift();

    neighbors = graph.edges[current];
    console.log("neighbors:" + neighbors);
    for (var j = 0; j < neighbors.length; j++) {
      if (nodesDis[neighbors[j]] == Infinity) {
        console.log("entered");
        nodesDis[neighbors[j]] = nodesDis[current] + 1;
        queue.push(neighbors[j]);
      } else{
        console.log("missed");
      }
    }
  }
  return nodesDis;
}
