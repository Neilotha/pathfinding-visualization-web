import {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualization.css';
import {dijkstra, getShortestPathDijkstra} from '../PathfindingAlgorithms/Dijkstra.js';
import {aStar} from '../PathfindingAlgorithms/Astar.js';
import {animateDijkstra, animateAStar} from './Animations.jsx';

const TOGGLE_WALL = '1';
const TOGGLE_START = '2';
const TOGGLE_FINISH = '3';

export default class PathfindingVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      gotStart: false,
      gotFinish: false,
      wallToggled: false,
      startToggled: false,
      finishToggled: false
    };


  }

  componentDidMount() {
    const grid = initializeGrid();
    this.setState({grid});
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const finishNode = this.findFinishNode(grid);
    const startNode = this.findStartNode(grid);
    const visitedNodes = dijkstra(grid, startNode);
    const shortestPath = getShortestPathDijkstra(finishNode);
    animateDijkstra(visitedNodes, shortestPath);

  }

  visualizeAstar() {
    const {grid} = this.state;
    const finishNode = this.findFinishNode(grid);
    const startNode = this.findStartNode(grid);
    const results = aStar(grid, startNode, finishNode);
    const visitedNodes = results[0];
    const shortestPath = results[1];
    animateAStar(visitedNodes, shortestPath);
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
      // Adding wall node
    if (this.state.wallToggled && this.validateAction(row, col, TOGGLE_WALL)) {
      const newGrid = initializeWallNode(row, col, this.state.grid);
      this.setState({grid: newGrid});
    }
    else if (this.state.startToggled && this.validateAction(row, col, TOGGLE_START)) {
      const newGrid = initializeStartNode(row, col, this.state.grid);
      this.setState({grid: newGrid, startToggled: false, gotStart: true});
    }
    else if (this.state.finishToggled && this.validateAction(row, col, TOGGLE_FINISH)) {
      const newGrid = initializeFinishNode(row, col, this.state.grid);
      this.setState({grid: newGrid, finishToggled: false, gotFinish: true});
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressed) {
      // Adding wall node
      if (this.state.wallToggled && this.validateAction(row, col, TOGGLE_WALL)) {
        const newGrid = initializeWallNode(row, col, this.state.grid);
        this.setState({grid: newGrid});
      }
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
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
    const list = document.querySelectorAll('.visited, .shortestPath'); 
    for (let i = 0; i < list.length; i ++) {
      list[i].className = 'node';
    }

    const newGrid = initializeGrid();
    this.setState({
      grid: newGrid,
      mouseIsPressed: false,
      gotStart: false,
      gotFinish: false,
      wallToggled: false
    });
  }

  render() {
    const {grid} = this.state;
    return (
      <>
        <div className="panel">
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button onClick={() => this.visualizeAstar()}>
            Visualize A* Algorithm
          </button>
          <button onClick = {() => this.handleStartToggle()}>Start</button>
          <button onClick = {() => this.handleFinishToggle()}>Finish</button>
          <button onClick = {() => this.handleWallToggle()}>Wall</button>
          <button onClick = {() => this.handleReset()}>Reset</button>
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

// Initialize an 2D array of nodes 
const initializeGrid = () => {
  const grid = [];
  for (let row = 0; row < 30; row ++) {
    const currentRow = [];
    for (let col = 0; col < 60; col ++) {
      currentRow.push(initializeNode(row, col));
    }      
    grid.push(currentRow);
  }

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
  const node = initializeNode(row, col);
  const newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

// Initializes a finish node and returns a new grid containing the new node
const initializeFinishNode = (row, col, grid) => {
  const newGrid = grid.slice();
  const node = initializeNode(row, col);
  const newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
