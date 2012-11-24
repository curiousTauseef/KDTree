var KDTree = require("./KDTree.js");

var a = KDTree.create_point([0,0], "a");
var b = KDTree.create_point([1,0], "b");
console.log("Distance from (0,0) to (1,0): ", KDTree.distance(a,b));


console.log("Creating points...");
var points = [a,b];
for (var i=0;i<1e6;i++){
    points.push(KDTree.create_point([Math.random(), Math.random()], i));
}

console.log("Inserting points in the tree...");
var t = Date.now();
var tree = KDTree.create(points);
console.log("Created a "+points.length+"-nodes tree in "+(Date.now()-t)+"ms.");


var point = KDTree.create_point([0.5,0.5], "SearchMe");
var t = Date.now();
var neighbor = KDTree.nearest_neighbor(tree, point);
console.log("Found the nearest neighbor in",(Date.now()-t),"ms.");
console.log("Nearest neighbor : ",neighbor);
