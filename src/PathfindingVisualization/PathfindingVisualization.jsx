import {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualization.css';

const TOOGLE_WALL = '1';
const TOOGLE_START = '2';
const TOOGLE_FINISH = '3';

export default class PathfindingVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      gotStart: false,
      gotFinish: false,
      wallToggled: false
    };


  }

  componentDidMount() {
    const grid = initializeGrid();
    this.setState({grid});
  }

  // Validates the action the user wants to performe
  validateAction = (row, col, action) => {
    const gridCopy = this.state.grid.slice();
    const node = gridCopy[row][col];
    let validation = false;
    switch (action) {
      // check if the node already has other attributes
      case TOOGLE_WALL:
        if(!node.isStarta && !node.isFinish) {
          validation = true;
        }
        break;
      // Check if there is already a start node and is not a finish node
      case TOOGLE_START:
        if(!this.state.gotStart && !node.isFinish) {
          validation = true;
        }
        break;
      //  Check if there is already a finish node and is not a start node
      case TOOGLE_FINISH:
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
    if (this.state.wallToggled && this.validateAction(row, col, TOOGLE_WALL)) {
      const newGrid = initializeWallNode(row, col, this.state.grid);
      this.setState({grid: newGrid});
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressed) {
      // Adding wall node
      if (this.state.wallToggled && this.validateAction(row, col, TOOGLE_WALL)) {
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

  // Resets the whole state
  handleReset() {
    this.setState({
      grid: initializeGrid(),
      mouseIsPressed: false,
      gotStart: false,
      gotFinish: false,
      wallToggled: false
    })
  }

  render() {
    const {grid} = this.state;
    return (
      <>
        <button>Start</button>
        <button>Finish</button>
        <button onClick = {() => this.handleWallToggle()}>Wall</button>
        <button onClick = {() => this.handleReset()}>Reset</button>
        <div className='grid'>
          {grid.map((row, rowId) => {
            return(
              <div className='row' key={rowId}>
                {row.map((node, nodeId) => {
                  const {row, col, isVisited, isWall, isStart, isFinish} = node;
                  return(
                    <Node
                      key = {nodeId}
                      row = {row}
                      col = {col}
                      isVisited = {isVisited}
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
  for (let row = 0; row < 25; row ++) {
    const currentRow = [];
    for (let col = 0; col < 70; col ++) {
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
    isVisited: false,
    isWall: false,
    isStart: false,
    isFinish: false
  };
};

// Initializes a wall node and returns a new grid containing the new node
const initializeWallNode = (row, col, grid) => {
  const newGrid = grid.slice();
  const node = initializeNode(row, col);
  const newNode = {
    ... node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

