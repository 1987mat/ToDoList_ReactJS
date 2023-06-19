import React, { useState, useEffect, useRef } from 'react';
import List from './components/List';
import './App.css';
import uniqid from 'uniqid';

const App = () => {
  // Initialize State
  const [state, setState] = useState({
    taskArr: [],
    task: {
      text: '',
      id: uniqid(),
      completed: false,
      edited: false,
      draggable: false,
    },
    editing: false,
    editText: '',
    taskToEdit: '',
  });

  // Refs
  const textInput = useRef();
  const heading = useRef();
  const subheading = useRef();
  const wrapper = useRef();
  const tasksList = useRef();
  const taskEditInput = useRef();
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Get tasks from Local Storage on page load
  useEffect(() => {
    window.addEventListener('load', getLocalStorageData);
    return () => window.removeEventListener('load', getLocalStorageData);

    function getLocalStorageData() {
      let localStorageData = JSON.parse(localStorage.getItem('tasks'));

      if (localStorageData !== null) {
        localStorageData.forEach((task) => {
          if (task.edited) {
            task.edited = false;
          }

          setState({
            ...state,
            taskArr: localStorageData,
            task: {
              text: '',
              id: state.task.id,
              completed: state.task.completed,
              edited: false,
              draggable: state.task.draggable,
            },
          });
        });
      }
    }
  });

  // Keyboard events
  useEffect(() => {
    window.addEventListener('keydown', keyboardEvents);
    return () => window.removeEventListener('keydown', keyboardEvents);

    function keyboardEvents(e) {
      if (e.key === 'Enter') {
        // Add task
        if (document.activeElement === textInput.current) {
          e.preventDefault();
          handleSubmit(e);
        }

        // Edit task
        if (state.editing) {
          let taskId = taskEditInput.current.id;
          confirmEdits(taskId);
        }
      }

      if (e.key === 'Escape' && state.editing) {
        // Exit edit mode
        setState({
          taskArr: state.taskArr,
          task: {
            text: '',
            id: state.task.id,
            completed: state.task.completed,
            edited: state.task.edited,
            draggable: state.task.draggable,
          },
          editing: false,
          editText: '',
          taskToEdit: '',
        });
      }
    }
  });

  // Toggle edit mode when clicking outside
  useEffect(() => {
    window.addEventListener('click', toggleEditMode);
    return () => window.removeEventListener('click', toggleEditMode);

    function toggleEditMode(e) {
      if (state.editing && !e.target.classList.contains('edit-input')) {
        setState({
          taskArr: state.taskArr,
          task: {
            text: '',
            id: state.task.id,
            completed: state.task.completed,
            edited: state.task.edited,
            draggable: state.task.draggable,
          },
          editing: !state.editing,
          editText: '',
          taskToEdit: '',
        });
      }
    }
  });

  // Fade in animation when page loads
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('fade-in', entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(entry.target);
        });
      },
      {
        treshold: 0.7,
      }
    );

    observer.observe(heading.current);
    observer.observe(subheading.current);
    observer.observe(wrapper.current);
  }, [heading, subheading, wrapper]);

  // Methods
  const handleChange = (e) => {
    setState({
      ...state,
      task: {
        text: e.target.value,
        id: state.task.id,
        completed: state.task.completed,
        edited: state.task.edited,
        draggable: state.task.draggable,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (textInput.current.value === '') {
      return;
    } else {
      state.taskArr.push(state.task);
      setState({
        taskArr: state.taskArr,
        task: {
          text: '',
          id: uniqid(),
          completed: false,
          edited: false,
          draggable: state.task.draggable,
        },
      });
    }

    setLocalStorage();
    textInput.current.value = '';
    textInput.current.focus();
  };

  const removeTask = (id) => {
    state.taskArr.forEach((task, index) => {
      if (task.id === id) {
        state.taskArr.splice(index, 1);
      }
    });

    setState({
      ...state,
      taskArr: state.taskArr,
    });

    setLocalStorage();
    textInput.current.focus();
  };

  const toggleComplete = (id) => {
    // Toggle checkbox checked value
    const updatedTasks = state.taskArr.map((task) => {
      if (task.id === id) {
        task.completed = !task.completed;
      }
      return task;
    });

    setState({
      ...state,
      taskArr: updatedTasks,
      task: {
        text: '',
        id: state.task.id,
        completed: state.task.completed,
        edited: state.task.edited,
        draggable: state.task.draggable,
      },
    });

    setLocalStorage();
  };

  const editTask = (id, e) => {
    if (
      !e.currentTarget.closest('.task-wrapper').classList.contains('completed')
    ) {
      const selectedItem = state.taskArr.find((task) => task.id === id);

      setState({
        ...state,
        taskArr: state.taskArr,
        task: {
          text: '',
          id: state.task.id,
          completed: state.task.completed,
          edited: false,
          draggable: state.task.draggable,
        },
        editing: true,
        editText: selectedItem.text,
        taskToEdit: selectedItem.id,
      });
    }
  };

  const handleEditChange = (e) => {
    setState({
      ...state,
      editText: e.target.value,
    });
  };

  const confirmEdits = (id) => {
    state.taskArr.forEach((el) => {
      if (el.id === id && state.editText !== el.text && state.editText !== '') {
        el.text = state.editText;
        el.edited = !el.edited;
      }
    });

    setState({
      ...state,
      taskArr: state.taskArr,
      task: {
        text: '',
        id: state.task.id,
        completed: state.task.completed,
        edited: state.task.edited,
        draggable: state.task.draggable,
      },
      editing: false,
      editText: '',
      taskToEdit: '',
    });

    setLocalStorage();
  };

  // Drag & Drop
  const dragMode = (e) => {
    if (e.type === 'mousedown') {
      e.target.closest('.task-wrapper').setAttribute('draggable', 'true');
    }
  };

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const dragEnd = () => {
    const copyArray = [...state.taskArr];
    const dragItemContent = copyArray[dragItem.current];

    // Switch tasks position
    copyArray.splice(dragItem.current, 1);
    copyArray.splice(dragOverItem.current, 0, dragItemContent);
    state.taskArr = copyArray;

    tasksList.current.firstElementChild.childNodes.forEach((el, index) => {
      if (dragItem.current === index) {
        el.draggable = false;
      }
    });

    dragItem.current = null;
    dragOverItem.current = null;

    state.taskArr.forEach((task) => {
      if (task.edited) {
        task.edited = false;
      }
    });

    setState({
      taskArr: state.taskArr,
      task: {
        text: '',
        id: state.task.id,
        completed: state.task.completed,
        edited: false,
        draggable: false,
      },
      editing: state.editing,
      editText: '',
      taskToEdit: '',
    });

    setLocalStorage();
  };

  const setLocalStorage = () => {
    const temp = JSON.stringify(state.taskArr);
    localStorage.setItem('tasks', temp);
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <h1 ref={heading} className="display-1 text-center mt-4 mb-5">
          To-Do List
        </h1>
        <p ref={subheading} className="text-center subheading">
          Create, modify and organize your checklist
          <i className="bi bi-calendar2-check"></i>
        </p>
        <div
          ref={wrapper}
          className="wrapper mx-auto d-flex flex-md-column justify-content-center card border-0 bg-transparent rounded"
        >
          <form className="card-body d-flex form-controls">
            <div className="field-wrapper">
              <i className="bi bi-pen-fill"></i>
              <input
                onChange={(e) => handleChange(e)}
                id="user-input"
                type="text"
                value={state.text}
                placeholder="Add Task..."
                maxLength="15"
                autoFocus
                className="mr-2 form-control form-control-lg shadow bg-white rounded"
                ref={textInput}
              ></input>
              <i
                className="bi bi-plus-lg add-task-icon"
                onClick={(e) => handleSubmit(e)}
              ></i>
            </div>
          </form>
          <List
            className="d-flex flex-column"
            removeTask={removeTask}
            editTask={editTask}
            handleEditChange={handleEditChange}
            handleSubmit={handleSubmit}
            confirmEdits={confirmEdits}
            toggleComplete={toggleComplete}
            tasks={state.taskArr}
            editText={state.editText}
            taskToEditID={state.taskToEdit}
            taskEditInputRef={taskEditInput}
            draggable={state.task.draggable}
            tasksList={tasksList}
            dragMode={dragMode}
            dragStart={dragStart}
            dragEnter={dragEnter}
            dragEnd={dragEnd}
          />
        </div>
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
};

export default App;
