import React, { Component } from 'react';

class Overview extends Component {
  render() {
    return (
      <ul className="card-body mt-4">
        {this.props.tasks.map((item) => {
          return (
            <div
              className="d-flex justify-content-between p-2 shadow bg-white rounded mb-3"
              key={item.id}
            >
              <li className="list-group">
                {/* Show task name or input */}
                {this.props.taskToEditID === item.id ? (
                  <input
                    onChange={(e) => this.props.handleEditChange(e)}
                    type="text"
                    className="form-control-sm no-border"
                    value={this.props.editText}
                  ></input>
                ) : (
                  <div className="list-el col sm-8">{item.text}</div>
                )}
              </li>

              <div className="d-flex gap-1">
                {this.props.taskToEditID !== item.id ? (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => this.props.toggleComplete(item.id, e)}
                  ></input>
                ) : (
                  ''
                )}

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
                <ion-icon
                  onClick={() => this.props.removeTask(item.id)}
                  name="trash"
                ></ion-icon>
              </div>
            </div>
          );
        })}
      </ul>
    );
  }
}

export default Overview;
