import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class Overview extends Component {
  render() {
    return (
      <ul className="card-body mt-4">
        <TransitionGroup>
          {this.props.tasks.map((item) => {
            return (
              <CSSTransition key={item.id} timeout={500} classNames="fade">
                <div
                  className={`task-wrapper d-flex justify-content-between p-2 shadow rounded mb-3${
                    item.edited ? ' edited' : ''
                  }${item.completed ? ' completed' : ''}`}
                >
                  {this.props.taskToEditID !== item.id ? (
                    <input
                      className="form-check-input check"
                      type="checkbox"
                      onChange={(e) => this.props.toggleComplete(item.id)}
                      checked={item.completed ? true : false}
                    ></input>
                  ) : (
                    ''
                  )}
                  <li className="list-group">
                    {/* Show task name or input */}
                    {this.props.taskToEditID === item.id ? (
                      <input
                        onChange={(e) => this.props.handleEditChange(e)}
                        type="text"
                        className="pl-1 edit-input"
                        value={this.props.editText}
                        autoFocus
                      ></input>
                    ) : (
                      <div className="list-el col sm-8">{item.text}</div>
                    )}
                  </li>

                  <div className="edit-delete-wrapper">
                    {this.props.taskToEditID === item.id ? (
                      <i
                        className="bi bi-check-lg"
                        onClick={() => this.props.submitEdits(item.id)}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-pencil-square"
                        onClick={(e) => this.props.editTask(item.id, e)}
                      ></i>
                    )}
                    <i
                      className="bi bi-trash3-fill"
                      onClick={() => this.props.removeTask(item.id)}
                    ></i>
                  </div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </ul>
    );
  }
}

export default Overview;
