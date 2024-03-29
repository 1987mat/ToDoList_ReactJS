import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const List = React.forwardRef((props, ref) => {
  return (
    <ul className="card-body mt-4" ref={props.tasksList}>
      <TransitionGroup>
        {props.tasks.map((item, index) => (
          <CSSTransition key={item.id} timeout={500} classNames="fade">
            <div
              draggable={props.draggable}
              onDragStart={(e) => props.dragStart(e, index)}
              onDragEnter={(e) => props.dragEnter(e, index)}
              onDragEnd={props.dragEnd}
              className={`task-wrapper d-flex justify-content-between p-2 shadow rounded mb-3${
                item.edited ? ' edited' : ''
              }${item.completed ? ' completed' : ''}`}
            >
              {props.taskToEditID !== item.id ? (
                <input
                  className="form-check-input check"
                  type="checkbox"
                  onChange={(e) => props.toggleComplete(item.id)}
                  checked={item.completed ? true : false}
                ></input>
              ) : (
                ''
              )}
              <li className="list-group">
                {/* Show task name or input */}
                {props.taskToEditID === item.id ? (
                  <input
                    onChange={(e) => props.handleEditChange(e)}
                    type="text"
                    className="pl-1 edit-input"
                    value={props.editText}
                    autoFocus
                    ref={props.taskEditInputRef}
                    id={item.id}
                  ></input>
                ) : (
                  <div className="list-el col sm-8">{item.text}</div>
                )}
              </li>

              <div className="edit-delete-wrapper">
                {props.taskToEditID === item.id ? (
                  <i
                    className="bi bi-check-lg"
                    onClick={() => props.confirmEdits(item.id)}
                  ></i>
                ) : (
                  <i
                    className="bi bi-pencil-square"
                    onClick={(e) => props.editTask(item.id, e)}
                  ></i>
                )}
                <i
                  className="bi bi-trash3-fill"
                  onClick={() => props.removeTask(item.id)}
                ></i>
                <i
                  className="bi bi-list"
                  onMouseDown={(e) => props.dragMode(e)}
                ></i>
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ul>
  );
});

export default List;
