import { MinPriorityQueue } from "./MinPrioirtyQueue";

export function dijkstra(grid, startNode) {
    // Stores the order of visited nodes
    let finishSearch = false;
    const visitedNodes = [];
    const unvisitedNodes = new MinPriorityQueue();
    prepareBoard(grid);
    // Set the distance of start node to 0 
    startNode.distance = 0;
    // Push the startNode into the min priority queue
    unvisitedNodes.insert(startNode);  

    // the loop stops when 1: found the shortest path to finish 2: realize there is no way to reach the finish
    while( !finishSearch ) {
        // if the distance of the current node is infinity, it means that we are traped and there is no way of reaching the finish
        // put the current node into the visited node set
        if( unvisitedNodes.size === 0 ) finishSearch = true;
        else {
            let currentNode = unvisitedNodes.extractMin();
            currentNode.isVisited = true;
            if( currentNode.isFinish ) finishSearch = true;
            else { 
                visitedNodes.push(currentNode);
                // Update the adjacent nodes
                updateAdjacentNodes(grid, currentNode, unvisitedNodes);
            }
        }
    }

    return visitedNodes;
}

// get the shortest path by back tracking from the finish node
export function getShortestPathDijkstra(finishNode) {
    const shortestPath = [];
    let currentNode = finishNode;
    while( currentNode !== null ) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}


// utility function for updating the current node's unvisited neighbors
function updateAdjacentNodes(grid, currentNode, minQueue) {
    const unvisitedAdjacentNodes = getAdjacentNodes(grid, currentNode);
    for( const  adjacentNode of unvisitedAdjacentNodes ) {
        // calculate the adjacentNode's distance through currentNode
        let newDistance = currentNode.distance + 1;
        // update Adjacent node's previous node to current node
        adjacentNode.previousNode = currentNode;
        if ( newDistance < adjacentNode.distance ) {
            if ( !adjacentNode.inQueue ) {
                adjacentNode.distance = newDistance;
                adjacentNode.previousNode = currentNode;
                minQueue.insert(adjacentNode);
            }
            else {
                minQueue.changePrioirty(minQueue.getIndex(adjacentNode), newDistance);
                adjacentNode.previousNode = currentNode;
            }
        }
    }
}

// utility funciton for getting the unvisited adjacent nodes of the giving node.
function getAdjacentNodes(grid, node) {
    const neighborNodes = [];
    const {row, col} = node;
    if( col < grid[0].length - 1 ) neighborNodes.push( grid[row][col + 1] );
    if( col > 0 ) neighborNodes.push( grid[row][col - 1] );
    if( row > 0 ) neighborNodes.push( grid[row - 1][col] );
    if( row < grid.length - 1 ) neighborNodes.push( grid[row + 1][col] );

    return neighborNodes.filter((neighbor) => !neighbor.isVisited && ! neighbor.isWall);
}

// utility funciotn for initializing the node's distance to infinity
function prepareBoard(grid) {
    for( const row of grid ) {
        for( const node of row ) {
            node.distance = Infinity;
            node.inQueue = false;
        }
    }
}