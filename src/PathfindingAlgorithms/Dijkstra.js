export function dijkstra(grid, startNode) {
    // Stores the order of visited nodes
    let finishSearch = false;
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);
    // Set the distance of start node to 0
    startNode.distance = 0;

    // the loop stops when 1: found the shortest path to finish 2: realize there is no way to reach the finish
    while( !finishSearch ) {
        sortNodesByDistance(unvisitedNodes);
        // get the node with the shortest distance
        const currentNode = unvisitedNodes.shift();
        // inspect the node
        // if the current node is a wall node, skip it
        if( currentNode.isWall ) continue;
        // if the distance of the current node is infinity, it means that we are traped and there is no way of reaching the finish
        // put the current node into the visited node set
        currentNode.isVisited = true;
        if( currentNode.distance === Infinity ) finishSearch = true;
        else {
            if( currentNode.isFinish ) finishSearch = true;
            else { 
                visitedNodes.push(currentNode);
                // Update the adjacent nodes
                updateAdjacentNodes(grid, currentNode);
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

// Utility funciton for sorting the unvisited nodes by distance
function sortNodesByDistance(unvisitNodes) {
    return unvisitNodes.sort((a, b) => a.distance - b.distance);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// utility function for updating the current node's unvisited neighbors
function updateAdjacentNodes(grid, currentNode) {
    const unvisitedAdjacentNodes = getAdjacentNodes(grid, currentNode);
    for( const  adjacentNode of unvisitedAdjacentNodes ) {
        // update adjacent node's distance
        adjacentNode.distance = currentNode.distance + 1;
        // update Adjacent node's previous node to current node
        adjacentNode.previousNode = currentNode;
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

    return neighborNodes.filter((neighbor) => !neighbor.isVisited);
}


