import React, { Component } from 'react';
import Overview from './components/Overview';
import './App.css';
import uniqid from 'uniqid';

class App extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();

    this.state = {
      taskArr: [],
      task: {
        text: '',
        id: uniqid(),
        completed: false,
        edited: false,
      },
      editing: false,
      editText: '',
      taskToEdit: '',
    };
  }

  // Get tasks from Local Storage on page load
  componentDidMount = () => {
    window.addEventListener('load', () => {
      let localStorageData = JSON.parse(localStorage.getItem('tasks'));

      if (localStorageData !== null) {
        localStorageData.forEach((task) => {
          if (task.completed) {
            this.setState({
              taskArr: localStorageData,
              task: {
                text: '',
                id: this.state.task.id,
                completed: task.completed,
                edited: task.edited,
              },
            });
            document
              .querySelectorAll('.list-el')
              .forEach((el) => console.log(el));
          } else {
            this.setState({
              taskArr: localStorageData,
              task: {
                text: '',
                id: this.state.task.id,
                completed: task.completed,
                edited: task.edited,
              },
            });
          }
        });
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      task: {
        text: e.target.value,
        id: this.state.task.id,
        completed: this.state.task.completed,
        edited: this.state.task.edited,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { taskArr, task } = this.state;

    if (document.getElementById('user-input').value === '') {
      return;
    } else {
      taskArr.push(task);
      this.setState({
        taskArr: taskArr,
        task: {
          text: '',
          id: uniqid(),
          completed: false,
          edited: false,
        },
      });
    }

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);

    this.textInput.current.focus();
  };

  removeTask = (id) => {
    const { taskArr } = this.state;
    taskArr.forEach((task, index) => {
      if (task.id === id) {
        taskArr.splice(index, 1);
      }
    });

    this.setState({
      task: {
        text: '',
        id: this.state.task.id,
      },
    });

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);
  };

  toggleComplete = (id) => {
    const { taskArr } = this.state;

    // Toggle checkbox checked value
    const updatedTasks = taskArr.map((task) => {
      if (task.id === id) {
        task.completed = !task.completed;
      }
      return task;
    });

    this.setState({
      taskArr: updatedTasks,
      task: {
        text: '',
        id: this.state.task.id,
        completed: !this.state.task.completed,
        edited: this.state.task.edited,
      },
    });

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);
  };

  editTask = (id, e) => {
    if (
      !e.currentTarget.closest('.task-wrapper').classList.contains('completed')
    ) {
      const { taskArr } = this.state;
      const selectedItem = taskArr.find((task) => task.id === id);

      this.setState({
        task: {
          text: '',
          id: this.state.task.id,
          completed: this.state.task.completed,
          edited: false,
        },
        editing: true,
        editText: selectedItem.text,
        taskToEdit: selectedItem.id,
      });
    }
  };

  handleEditChange = (e) => {
    this.setState({
      editText: e.target.value,
    });
  };

  submitEdits = (id) => {
    const { taskArr, editText } = this.state;
    taskArr.forEach((el) => {
      if (el.id === id && editText !== el.text && editText !== '') {
        el.text = editText;
        el.edited = true;
        setTimeout(() => {
          el.edited = false;
        }, 500);
      }
    });

    this.setState({
      taskArr: taskArr,
      task: {
        text: '',
        id: this.state.task.id,
        completed: this.state.task.completed,
      },
      editing: false,
      editText: '',
      taskToEdit: '',
    });

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);
  };

  render() {
    const { task, taskArr } = this.state;
    return (
      <div className="container">
        <h1 className="display-1 text-center mt-4 mb-5">To-Do List</h1>
        <p className="text-center subheading">
          Create, modify and organize your checklist
          <i className="bi bi-calendar2-check"></i>
        </p>
        <div className="wrapper mx-auto d-flex flex-md-column justify-content-center card border-0 bg-transparent rounded">
          <form className="card-body d-flex form-controls">
            <div className="field-wrapper">
              <i className="bi bi-pen-fill"></i>
              <input
                onChange={(e) => this.handleChange(e)}
                id="user-input"
                type="text"
                value={task.text}
                placeholder="Add Task..."
                maxLength="15"
                autoFocus
                className="mr-2 form-control form-control-lg shadow bg-white rounded"
                ref={this.textInput}
              ></input>
              <i
                className="bi bi-plus-lg add-task-icon"
                onClick={(e) => this.handleSubmit(e)}
              ></i>
            </div>
          </form>
          <Overview
            className="d-flex flex-column"
            tasks={taskArr}
            removeTask={this.removeTask}
            editTask={this.editTask}
            handleEditChange={this.handleEditChange}
            handleSubmit={this.handleSubmit}
            addTask={this.addTask}
            editText={this.state.editText}
            taskToEditID={this.state.taskToEdit}
            submitEdits={this.submitEdits}
            toggleComplete={this.toggleComplete}
            isCompleted={this.state.task.completed}
          />
        </div>
        <footer className="footer text-center fixed-bottom mb-2 font-weight-bold">
          <span>
            Developed by <span className="author">Mat</span>
          </span>
          <a
            className="text-reset ml-1"
            href="https://github.com/1987mat"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-github"></i>
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
