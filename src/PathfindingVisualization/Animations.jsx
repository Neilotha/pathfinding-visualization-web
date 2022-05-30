export function animateDijkstra(visitedNodes, shortestPath) {
    for( let i = 1; i < visitedNodes.length; i ++ ) {
        if ( i === visitedNodes.length - 1 ) {
        setTimeout( () => {
            animateShortestPath( shortestPath );
        }, 6.5 * i)
        }
        setTimeout( () => {
        const node = visitedNodes[i];
        document.getElementById( `${node.row}-${node.col}` ).className = 'node visited';
        }, 6 * i)
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