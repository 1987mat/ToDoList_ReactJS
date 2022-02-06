import React, { Component } from 'react';

class Overview extends Component {
  render() {
    return (
      <ul>
        {this.props.tasks.map((item) => {
          return (
            <div className="container" key={item.id}>
              <li>
                {/* Show task name or input */}
                {this.props.taskToEditID === item.id ? (
                  <input
                    onChange={(e) => this.props.handleEditChange(e)}
                    type="text"
                    className="input-edit"
                    value={this.props.editText}
                  ></input>
                ) : (
                  <div className="list-el ">{item.text}</div>
                )}
              </li>
              {this.props.taskToEditID !== item.id ? (
                <input
                  type="checkbox"
                  onChange={(e) => this.props.toggleComplete(item.id, e)}
                ></input>
              ) : (
                ''
              )}

              <div className="btn-wrapper">
                <ion-icon
                  onClick={() => this.props.removeTask(item.id)}
                  name="trash"
                ></ion-icon>

                {/* Show Edit or Confirm Button */}
                {this.props.taskToEditID === item.id ? (
                  <ion-icon
                    onClick={() => this.props.submitEdits(item.id)}
                    name="checkmark"
                  ></ion-icon>
                ) : (
                  <ion-icon
                    onClick={() => this.props.editTask(item.id)}
                    name="create"
                  ></ion-icon>
                )}
              </div>
            </div>
          );
        })}
      </ul>
    );
  }
}

export default Overview;
