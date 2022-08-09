import React, { Component } from 'react';
import Overview from './components/Overview';
import './App.css';
import uniqid from 'uniqid';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskArr: [],
      task: {
        text: '',
        id: uniqid(),
        completed: false,
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
        },
      });
    }

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);
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
      },
    });

    // Local Storage
    const temp = JSON.stringify(taskArr);
    localStorage.setItem('tasks', temp);
  };

  editTask = (id) => {
    const { taskArr } = this.state;
    const selectedItem = taskArr.find((task) => task.id === id);

    this.setState({
      editing: true,
      editText: selectedItem.text,
      taskToEdit: selectedItem.id,
    });
  };

  handleEditChange = (e) => {
    this.setState({
      editText: e.target.value,
    });
  };

  submitEdits = (id) => {
    const { taskArr, editText } = this.state;
    taskArr.forEach((el) => {
      if (el.id === id) {
        el.text = editText;
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
      <div className="container p-5">
        <h1 className="display-1 text-center mt-4 mb-5">ToDoList</h1>
        <div className="mx-auto p-4 d-flex flex-md-column justify-content-start mt-4 card w-75 border-0 p-3 mb-5 bg-transparent rounded">
          <form
            onSubmit={(e) => this.handleSubmit(e)}
            className="card-body d-flex form-controls"
          >
            <input
              onChange={(e) => this.handleChange(e)}
              id="user-input"
              type="text"
              value={task.text}
              placeholder="Enter Task"
              maxLength="15"
              autoFocus
              className="mr-2 form-control form-control-lg shadow bg-white rounded"
            ></input>
            <button className="btn btn-primary btn-lg" type="submit">
              Add Task
            </button>
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
          Developed by Mat
          <a
            className="text-reset ml-1"
            href="https://github.com/1987mat"
            target="_blank"
            rel="noreferrer"
          >
            <ion-icon name="logo-github"></ion-icon>
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
