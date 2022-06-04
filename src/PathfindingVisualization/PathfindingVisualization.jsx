import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualization.css';
import {dijkstra, getShortestPathDijkstra} from '../PathfindingAlgorithms/Dijkstra.js';
import {aStar} from '../PathfindingAlgorithms/Astar.js';
import {animateDijkstra, animateAStar, instantRenderDijkstra, instantRenderAStar} from './Animations.jsx';

const TOGGLE_WALL = '1';
const TOGGLE_START = '2';
const TOGGLE_FINISH = '3';
const DIJKSTRA = '1';
const ASTAR = '2';

export default class PathfindingVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      draggingStart: false,
      draggngFinish: false,
      wasSearched: false,
      searchedAlgorithm: null
      // gotStart: false,
      // gotFinish: false,
      // wallToggled: false,
      // startToggled: false,
      // finishToggled: false
      
    };


  }

  componentDidMount() {
    const grid = initializeGrid();
    this.setState({grid});
  }

  visualizeDijkstra(instantRender) {
    this.clearPath();
    const {grid} = this.state;
    const finishNode = this.findFinishNode(grid);
    const startNode = this.findStartNode(grid);
    const visitedNodes = dijkstra(grid, startNode);
    const shortestPath = getShortestPathDijkstra(finishNode);
    if ( instantRender ) instantRenderDijkstra(visitedNodes, shortestPath);
    else {
      animateDijkstra(visitedNodes, shortestPath);
      this.setState({wasSearched: true, searchedAlgorithm: DIJKSTRA});
    }
  }

  visualizeAstar(instantRender) {
    this.clearPath();
    const {grid} = this.state;
    const finishNode = this.findFinishNode(grid);
    const startNode = this.findStartNode(grid);
    const results = aStar(grid, startNode, finishNode);
    const visitedNodes = results[0];
    const shortestPath = results[1];
    if ( instantRender ) instantRenderAStar(visitedNodes, shortestPath);
    else {
      animateAStar(visitedNodes, shortestPath);
      this.setState({wasSearched: true, searchedAlgorithm: ASTAR});
    }
  }


  // Finds the start node form the grid
  findStartNode(grid) {
    let startNode = null;
    for ( const row of grid ) {
      startNode = row.find(node => node.isStart );
      if( startNode !== undefined ) break;
    }
    return startNode;
  }

  // Finds the finish node from the grid
  findFinishNode(grid) {
    let finishNode = null;
    for ( const row of grid ) {
      finishNode = row.find(node => node.isFinish );
      if( finishNode !== undefined ) break;
    }
    return finishNode;
  }

  // Validates the action the user wants to performe
  validateAction = (row, col, action) => {
    const gridCopy = this.state.grid.slice();
    const node = gridCopy[row][col];
    let validation = false;
    switch (action) {
      // check if the node already has other attributes
      case TOGGLE_WALL:
        if(!node.isStart && !node.isFinish) {
          validation = true;
        }
        break;
      // Check if there is already a start node and is not a finish node
      case TOGGLE_START:
        if(!this.state.gotStart && !node.isFinish) {
          validation = true;
        }
        break;
      //  Check if there is already a finish node and is not a start node
      case TOGGLE_FINISH:
        if(!this.state.gotFinish && !node.isStart) {
          validation = true;
        }
        break;

      default:
        console.log("Undefined action detected!");
        break;
    }
    
    return validation;
  };

  handleMouseDown(row, col) {
    this.setState({mouseIsPressed: true});
    // Clicking on the start node
    if ( this.state.grid[row][col].isStart && !this.state.draggingStart && !this.state.draggngFinish ) {
      this.setState( { draggingStart: true } );
    }
    // Clicking on the finish node
    else if ( this.state.grid[row][col].isFinish && !this.state.draggingStart && !this.state.draggngFinish ) {
      this.setState( { draggngFinish: true } );
    }
    // Adding wall node
    // else if (this.state.wallToggled && this.validateAction(row, col, TOGGLE_WALL)) {
    else if ( this.validateAction(row, col, TOGGLE_WALL)) {

      const newGrid = initializeWallNode(row, col, this.state.grid);
      this.setState({grid: newGrid});
    }
    // else if (this.state.startToggled && this.validateAction(row, col, TOGGLE_START)) {
    //   const newGrid = initializeStartNode(row, col, this.state.grid);
    //   this.setState({grid: newGrid, startToggled: false, gotStart: true});
    // }
    // else if (this.state.finishToggled && this.validateAction(row, col, TOGGLE_FINISH)) {
    //   const newGrid = initializeFinishNode(row, col, this.state.grid);
    //   this.setState({grid: newGrid, finishToggled: false, gotFinish: true});
    // }
  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressed) {
      // Dragging start node, putting down start node if finish node isn't already there
      if ( this.state.draggingStart && !this.state.grid[row][col].isFinish ) {
        const newGrid = dragStartOrFinishNode( this.findStartNode( this.state.grid ), this.state.grid, true, row, col );
        this.setState( { grid: newGrid } );
      }
      //  Dragging finish node, putting down finish node if start node isn't already there
      else if ( this.state.draggngFinish && !this.state.grid[row][col].isStart ) {
        const newGrid = dragStartOrFinishNode( this.findFinishNode( this.state.grid ), this.state.grid, false, row, col );
        this.setState( { grid: newGrid } );
        console.log(this.state.wasSearched, this.state.searchedAlgorithm);
        if ( this.state.wasSearched && this.state.searchedAlgorithm !== null ) {
          if ( this.state.searchedAlgorithm === DIJKSTRA ) this.visualizeDijkstra( true );
          else if ( this.state.searchedAlgorithm === ASTAR ) this.visualizeAstar( true );
        } 
      }
      // Adding wall node
      // else if (this.state.wallToggled && this.validateAction(row, col, TOGGLE_WALL)) {
      else if (this.validateAction(row, col, TOGGLE_WALL)) {

        const newGrid = initializeWallNode(row, col, this.state.grid);
        this.setState({grid: newGrid});
      }
    }
  }

  handleMouseUp() {
    const wasDragging = this.state.draggingStart || this.state.draggngFinish;
    this.setState({mouseIsPressed: false, draggingStart: false, draggngFinish: false});
    // if ( wasDragging ) this.handleClearSearch();
  }

  handleWallToggle() {
    this.setState(prevState => ({wallToggled: !prevState.wallToggled}));
  }

  handleStartToggle() {
    this.setState({wallToggled: false, startToggled: true, finishToggled: false});
  }

  handleFinishToggle() {
    this.setState({wallToggled: false, startToggled: false, finishToggled: true});
  }

  // Resets the whole state
  handleReset() {
    const list = document.querySelectorAll('.visited, .shortestPath, .visited-instant, .shortestPath-instant'); 
    for (let i = 0; i < list.length; i ++) {
      list[i].className = 'node';
    }
    
    const newGrid = initializeGrid();
    this.setState({
      grid: newGrid,
      mouseIsPressed: false,
      draggingStart: false,
      draggngFinish: false,
      wasSearched: false,
      searchedAlgorithm: null
      // gotStart: false,
      // gotFinish: false,
      // wallToggled: false
    });
  }

  // Clear the previous search result
  handleClearSearch() {
    const gridCoppy = this.state.grid.slice();
    const list = document.querySelectorAll('.visited, .shortestPath, .visited-instant, .shortestPath-instant'); 
    for (let i = 0; i < list.length; i ++) {
      list[i].className = 'node';
    }

    for( const row of gridCoppy ) {
      for( const node of row ) {
        node.previousNode = null;
        node.isVisited = false;
      }
    }

    this.setState({
      grid: gridCoppy,
      mouseIsPressed: false,
      draggingStart: false,
      draggngFinish: false,
      wasSearched: false,
      searchedAlgorithm: null
      // wallToggled: false
    });
  }

  clearPath() {
    const gridCoppy = this.state.grid.slice();
    const list = document.querySelectorAll('.visited, .shortestPath, .visited-instant, .shortestPath-instant'); 
    for (let i = 0; i < list.length; i ++) {
      list[i].className = 'node';
    }

    for( const row of gridCoppy ) {
      for( const node of row ) {
        node.previousNode = null;
        node.isVisited = false;
      }
    }

  }

  // Clear wall node and search result 
  handleClearWall() {
    this.handleClearSearch();
    const gridCoppy = this.state.grid.slice();

    for( let row = 0; row < gridCoppy.length; row ++ ) {
      for( let col = 0; col < gridCoppy[0].length; col ++ ) {
        console.log(gridCoppy[row][col]);
        if( gridCoppy[row][col].isWall ) {
          gridCoppy[row][col] = initializeNode(row, col);
        }
      }
    }

    this.setState({
      grid: gridCoppy,
      mouseIsPressed: false,
      // wallToggled: false
    });
  }

  render() {
    const {grid} = this.state;
    return (
      <>
        <div className="panel">
          <h1 className='title'>Pathfinding Visualization</h1>
          <div className='btn-group' role="group">
            <button type="button" className="btn btn-outline-light" onClick={() => this.visualizeDijkstra( false )}>
              Visualize Dijkstra's Algorithm
            </button>
            <button type="button" className="btn btn-outline-light" onClick={() => this.visualizeAstar( false )}>
              Visualize A* Algorithm
            </button>
          </div>
          {/* <button onClick = {() => this.handleStartToggle()}>Start</button>
          <button onClick = {() => this.handleFinishToggle()}>Finish</button>
          <button onClick = {() => this.handleWallToggle()}>Wall</button> */}
          <div className='btn-group' role="group">
            <button type="button" className='btn btn-outline-light' onClick = {() => this.handleReset()}>Reset Board</button>
            <button type="button" className='btn btn-outline-light' onClick = {() => this.handleClearWall()}>Clear Wall</button>
            <button type="button" className='btn btn-outline-light' onClick = {() => this.handleClearSearch()}>Clear Search</button>
          </div>
        </div>
        <div className='grid noselect'>
          {grid.map((row, rowId) => {
            return(
              <div className='row' key={rowId}>
                {row.map((node, nodeId) => {
                  const {row, col, isWall, isStart, isFinish} = node;
                  return(
                    <Node
                      key = {nodeId}
                      row = {row}
                      col = {col}
                      isWall = {isWall}
                      isStart = {isStart}
                      isFinish = {isFinish}
                      onMouseDown = {(row, col) => {this.handleMouseDown(row, col)}}
                      onMouseEnter = {(row, col) => {this.handleMouseEnter(row, col)}}
                      onMouseUp = {() => {this.handleMouseUp()}}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// Initialize an 2D array of nodes 
const initializeGrid = () => {
  const grid = [];
  const height = window.innerHeight - convertRemToPixels(6);
  const width = window.innerWidth;
  const totalRow = Math.floor( height / 25 );
  const totalCol = Math.floor( width / 25 );
  for (let row = 0; row < totalRow; row ++) {
    const currentRow = [];
    for (let col = 0; col < totalCol; col ++) {
      currentRow.push(initializeNode(row, col));
    }      
    grid.push(currentRow);
  }

  initializeStartNode( Math.floor( totalRow / 2 ), Math.floor( totalCol / 3 ), grid );
  initializeFinishNode( Math.floor( totalRow / 2 ), Math.floor( ( totalCol / 3 ) * 2 ), grid );

  return grid;
};

// Initialize a node base on given row and col
const initializeNode = (row, col) => {
  return{
    row,
    col,
    previousNode: null,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    wasWall: false,
    isStart: false,
    isFinish: false
  };
};

// Initializes a wall node and returns a new grid containing the new node
const initializeWallNode = (row, col, grid) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

// Initializes a start node and returns a new grid containing the new node
const initializeStartNode = (row, col, grid) => {
  const newGrid = grid.slice();
  const oldNode = newGrid[row][col];
  const node = initializeNode(row, col);
  const newNode = {
    ...node,
    isStart: true,
    wasWall: oldNode.isWall,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

// Initializes a finish node and returns a new grid containing the new node
const initializeFinishNode = (row, col, grid) => {
  const newGrid = grid.slice();
  const oldNode = newGrid[row][col];
  const node = initializeNode(row, col);
  const newNode = {
    ...node,
    isFinish: true,
    wasWall: oldNode.isWall,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

// Discard start or finish node, also restore wall node if the node was a wall node
// then initialize a start or finish node on the given position
const dragStartOrFinishNode = (node, grid, isStart, targetRow, targetCol) => {
  let newGrid = grid.slice();
  const row = node.row;
  const col = node.col;
  if ( node.wasWall ) {
    newGrid[row][col] = initializeNode(row, col);
    newGrid = initializeWallNode(row, col, newGrid);
  }
  else {
    newGrid[row][col] = initializeNode(row, col);
  }

  

  if ( isStart ) {
    newGrid = initializeStartNode( targetRow, targetCol, newGrid );
  }
  else {
    newGrid = initializeFinishNode( targetRow, targetCol, newGrid );
  }

  return newGrid;
}
