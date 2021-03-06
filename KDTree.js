var KDTree = {
    "create_point" : function (coords, value) {
        return {
            "coords" : coords,
            "value"  : value,
        }
    },
    "distance" : function (p1,p2) {
        //By default, use the square of euclidian's distance
        if (p1.coords.length!==p2.coords.length)console.log("err",p1,p2);
        for(var sum=0,i=0;i<p1.coords.length;i++) {
            var diff = p1.coords[i]-p2.coords[i];
            sum += diff*diff;
        }
        return sum;
    },
    "create" : function (points, depth) {
        if (!depth) depth = 0;
        var dimension = points[0].coords.length, //All objects must be the same length
            node={};
        node.axis = depth % dimension;

        points.sort(function (obj1, obj2){
            return obj1.coords[node.axis] - obj2.coords[node.axis];
        });

        var median = Math.floor(points.length/2);

        node.point = points[median]; //Choose the median point

        
        node.leftChild = (median>0) ?
                            KDTree.create(points.slice(0,median), depth+1) :
                            null;

        node.rightChild = (median<points.length-1) ?
                            KDTree.create(points.slice(median+1), depth+1) :
                            null;
        return node;
    },

    "nearest_neighbors" : function (tree, point, neighborsNumber) {
        //Find the neighborsNumber nearest neighbors of point in tree

        var path = [], curNode = tree,
            dimension = point.coords.length,
            coords = point.coords;
        while (true) {        //First, find where the point would be inserted
            path.push(curNode);
            if (coords[curNode.axis] < curNode.point.coords[curNode.axis]){
                if (curNode.leftChild === null) break;
                curNode = curNode.leftChild;
            }else{
                if (curNode.rightChild === null) break;
                curNode = curNode.rightChild;
            }
        }

        var nearest_neighbors = [];
        function propose_neighbor (neighbor) {
            //If neighbor (a point) if further from point than the current furthest neighbor, return false
            //Else, add neighbor to the nearest neighbors, and return true
            neighbor.distance = KDTree.distance(neighbor, point);
            if (nearest_neighbors.length == neighborsNumber) {
                //nearest_neighbors has reached its maximal length, we need either
                //to reject the proposition, or to remove one element from "nearest_neighbors"
                var longest_distance = nearest_neighbors[nearest_neighbors.length-1].distance;
                if (neighbor.distance > longest_distance) return false;
                nearest_neighbors.pop();
            }
            var i=0;
            while(i < nearest_neighbors.length &&
                  nearest_neighbors[i].distance < neighbor.distance) i++; //Find the position of the new element
            nearest_neighbors.splice(i,0,neighbor); //Insert obj in the nearest neighbors at the right place
            return true;
        }

        function search_neighbors (node, comeFrom) {
            //Recursive function that will find all the nearest neighbors among node and its descendants
            propose_neighbor(node.point);
            var diff = node.point.coords[node.axis]-point.coords[node.axis],
                search_radius = nearest_neighbors[nearest_neighbors.length-1].distance;
            if (diff*diff < search_radius) { //We use squared norms in distance in order not to have to compute a square root
                //If the proposition was accepted, we need to check wether the nodes'
                //children should be added too.
                if (node.leftChild !== null && node.leftChild !== comeFrom){
                    search_neighbors(node.leftChild);
                }
                if (node.rightChild !== null && node.rightChild !== comeFrom) {
                     search_neighbors(node.rightChild);
                }
            }
        }
        for (var i = path.length-1; i>=0; i--) {
            search_neighbors(path[i], path[i+1]);
        }
        return nearest_neighbors;
    },
    "nearest_neighbor" : function(tree, point) {
        return KDTree.nearest_neighbors(tree, point,1)[0];        
    }
}

if (typeof exports !== 'undefined') {
    for (var i in KDTree) {
        exports[i] = KDTree[i];
    }
}
