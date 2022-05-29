import React, { Component } from 'react'

import './Node.css';

class Node extends Component {

  render() { 
    const {
      row,
      col,
      isWall,
      isStart,
      isFinish,
      onMouseDown,
      onMouseEnter,
      onMouseUp
    } = this.props;

    const classes = 'node' + 
    (isWall ? " isWall" 
    : isStart ? " isStart" 
    : isFinish ? " isFinish"
    : "");

    return (  
      <div 
        id={`${row}-${col}`}
        onMouseDown = {() => onMouseDown(row, col)}
        onMouseEnter = {() => onMouseEnter(row, col)}
        onMouseUp = {() => onMouseUp()}
        className ={classes}
      ></div>
    );
  }

  
}

export default Node;