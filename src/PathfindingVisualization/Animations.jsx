export function animateDijkstra(visitedNodes, shortestPath) {
    for( let i = 1; i < visitedNodes.length; i ++ ) {
        if ( i === visitedNodes.length - 1 ) {
        setTimeout( () => {
            animateShortestPath( shortestPath );
        }, 10.8 * i)
        }
        setTimeout( () => {
        const node = visitedNodes[i];
        document.getElementById( `${node.row}-${node.col}` ).className = 'node visited';
        }, 10 * i)
    }
}


function animateShortestPath(shortestPath) {
    for( let i = 1; i < shortestPath.length - 1; i ++ ) {
        setTimeout( () => {
        const node = shortestPath[i];
        document.getElementById( `${node.row}-${node.col}` ).className = 'node shortestPath';
        }, 30 * i)
    }
}

export function animateAStar(visitedNodes, shortestPath) {
    for( let i = 1; i < visitedNodes.length; i ++ ) {
        if ( i === visitedNodes.length - 1 ) {
        setTimeout( () => {
            animateShortestPath( shortestPath );
        }, 21 * i)
        }
        setTimeout( () => {
        const node = visitedNodes[i];
        document.getElementById( `${node.row}-${node.col}` ).className = 'node visited';
        }, 20 * i)
    }
}