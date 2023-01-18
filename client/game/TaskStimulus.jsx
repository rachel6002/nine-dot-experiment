import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { round, stage, player } = this.props;

    return (
      <div className="task-stimulus">
        Welcome to the Nine Dot Experiment! 
        <h2>Task: Try lining up ALL dots by using 4 straight lines.</h2>
        <h3>Drag pointer from dot to dot to form a straight line.</h3>
      </div>
    );
  }
}
