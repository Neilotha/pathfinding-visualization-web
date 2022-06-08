import { MinPriorityQueue } from "./MinPrioirtyQueue_AStar";

export function aStar(grid, startNode, targetNode) {
    // Initial 2 lists: open and closed
    const openList = new MinPriorityQueue();
    const closedList = [];
    const nodeVisitOrder = [];
    const results = [];
    let finishSearch = false;
    
    prePareNodes(grid);
    // Push the starting node to the open list and set the f-value to  0
    startNode.distance = 0;
    startNode.h = 0;
    startNode.g = 0;
    openList.insert(startNode);
    while(openList.size > 0 && !finishSearch) {
        // Find the node with the smallest f-value on the open list and pop it
        const currentNode = openList.extractMin();
        // Push currentNode to closed list
        closedList.push(currentNode);
        // If the currentNode is the goal, stop the search
        if( currentNode.isFinish ) {
            finishSearch = true;
        }
        else {
            nodeVisitOrder.push(currentNode);
            // generate current node's successor
            const successors = getSuccessor(grid, currentNode);
            for( const successor of successors ) {
                // Calculate h-value and g-value of successor
                const successorNewF = calculateFValue(currentNode, targetNode, successor);
                // If the new path to neighbor has better g-value than the current best path
                // and the neighbor is already in the closed list
                if( successorNewF[0] < successor.g && closedList.includes(successor, 0) ) {
                    // replace the neighbor with the new, lower, g value 
                    // current node is now the neighbor's parent 
                    successor.g = successorNewF[0];
                    successor.previousNode = currentNode;
                }
                // else if the new path to neighbor has better g-value than the current best path
                // and the neighbor is already in the open list
                else if( successorNewF[0] < successor.g && successor.inQueue ) {
                    //  replace the neighbor with the new, lower, g value 
                    //  change the neighbor's parent to our current node
                    openList.changePrioirty(openList.getIndex(successor) , successor.h, successorNewF[0] )
                    successor.previousNode = currentNode;
                }
                // else if this neighbor is not in both lists
                else if( !closedList.includes(successor, 0) && !successor.inQueue ) {
                    // add it to the open list and set its g and h
                    successor.previousNode = currentNode;
                    successor.g = successorNewF[0];
                    successor.h = successorNewF[1];
                    successor.distance = successorNewF[0] + successorNewF[1];
                    openList.insert(successor);
                }

            }
        }
    }

    results.push(nodeVisitOrder);
    results.push(getShortestPath(targetNode));
    return results;
}

// Utility function for adding g-value and h-value to each node
function prePareNodes(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.g = Infinity;
            node.h = Infinity;
            node.inQueue = false;
        }
    }
}

function getSuccessor(grid, node) {
    const successors = [];
    const {row, col} = node;
    if( col < grid[0].length - 1 ) successors.push( grid[row][col + 1] );
    if( col > 0 ) successors.push( grid[row][col - 1] );
    if( row > 0 ) successors.push( grid[row - 1][col] );
    if( row < grid.length - 1 ) successors.push( grid[row + 1][col] );

    return successors.filter((successor) => !successor.isWall);
}

// Utility funciton for caluculating the f value of a givin successor
function calculateFValue(currentNode, finishNode, successor) {
    const fValue = [];
    fValue[0] = currentNode.g + 1;
    fValue[1] = Math.abs(successor.row - finishNode.row) + Math.abs(successor.col - finishNode.col);
    
    return fValue;
}


function getShortestPath(finishNode) {
    const shortestPath = [];
    let currentNode = finishNode;
    while( currentNode !== null ) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}