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
      },
      editing: false,
      editText: '',
      taskToEdit: '',
      completed: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      task: { text: e.target.value, id: this.state.task.id },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (document.getElementById('user-input').value !== '') {
      this.setState({
        taskArr: this.state.taskArr.concat(this.state.task),
        task: { text: '', id: uniqid() },
      });
    } else {
      return;
    }
  };

  removeTask = (id) => {
    const { taskArr } = this.state;
    taskArr.splice(id, 1);
    this.setState({
      taskArr: taskArr,
    });
  };

  toggleComplete = (id, e) => {
    const { taskArr, completed } = this.state;

    taskArr.forEach((task) => {
      if (task.id === id) {
        this.setState({
          completed: !completed,
        });

        // Apply styling if task is completed
        const completedTask = e.target.previousElementSibling.firstElementChild;
        e.target.checked
          ? completedTask.classList.add('completed')
          : completedTask.classList.remove('completed');
      }
    });
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
      task: { text: '', id: this.state.task.id },
      editing: false,
      editText: '',
      taskToEdit: '',
    });
  };

  render() {
    const { task, taskArr, completed } = this.state;
    return (
      <div>
        <h1 className="display-1 text-center  mt-4 mb-5">ToDoList</h1>
        <div className="bg-light mx-auto p-4 d-flex flex-md-column justify-content-start mt-4 card w-50">
          <form
            onSubmit={this.handleSubmit}
            className="card-body d-flex form-controls"
          >
            <input
              onChange={(e) => this.handleChange(e)}
              id="user-input"
              type="text"
              value={task.text}
              placeholder="Enter Task..."
              className="mr-2 form-control form-control-lg"
            ></input>
            <button className="btn btn-primary btn-lg" type="submit">
              Add Task
            </button>
          </form>
          <Overview
            className="d-flex flex-column"
            tasks={taskArr}
            editing={this.editing}
            removeTask={this.removeTask}
            editTask={this.editTask}
            handleEditChange={this.handleEditChange}
            handleSubmit={this.handleSubmit}
            addTask={this.addTask}
            editText={this.state.editText}
            taskToEditID={this.state.taskToEdit}
            submitEdits={this.submitEdits}
            toggleComplete={this.toggleComplete}
            completed={completed}
          />
        </div>
        <footer className="fixed-bottom text-center mb-1">
          Developed by Mat
          <a
            className="text-reset ml-1 mt-1"
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
