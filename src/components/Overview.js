import React, { Component } from 'react';

class Overview extends Component {
  render() {
    return (
      <ul className="card-body mt-4">
        {this.props.tasks.map((item) => {
          return (
            <div className="d-flex gap-2 p-2" key={item.id}>
              <li className="list-group">
                {/* Show task name or input */}
                {this.props.taskToEditID === item.id ? (
                  <input
                    onChange={(e) => this.props.handleEditChange(e)}
                    type="text"
                    className="form-control-sm"
                    value={this.props.editText}
                  ></input>
                ) : (
                  <div className="list-el col sm-8">{item.text}</div>
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

              <div className="ml-5 float-right">
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
