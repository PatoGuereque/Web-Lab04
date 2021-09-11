/**
 * Helper function to return the first element with the specified class name.
 * All of the HTML nodes use class instead of id for some unknown reason.
 *
 * @param {string} name the name of the class
 * @returns {Element} the element of the class
 */
const getElementByClass = (name) => {
  return document.getElementsByClassName(name)[0];
};

/**
 * Div that will hold all of the todo items
 */
const todoList = getElementByClass("listOfTodos");

/**
 * The input element where the text for the new todo item
 * will be retrieved from
 */
const todoInput = getElementByClass("newTodo");

/**
 * The "Post Todo" button that will add a new todo item
 */
const submitButton = getElementByClass("submitButton");

/**
 * The button that will clear all of the todo's checkboxes
 */
const clearButton = getElementByClass("clearButton");

/**
 * The button that will mark all of the todo's checkboxes
 */
const markAllButton = getElementByClass("markAllButton");

/**
 * The button that will remove all of the todo elements
 */
const deleteButton = getElementByClass("deleteButton");

/**
 * Counter that will keep track of the todo ids
 */
let counter = 0;

/**
 * Our array of Todos that will be synced to the page
 * This can be modified and then updated on the page
 * using the renderTodos() method
 */
let todos = []; // Todo[]
/*interface Todo = {
    content: string;
    checked: boolean;
    id: string;
    node?: {
        div: HTMLDivElement;
        label: HTMLLabelElement;
        checkbox: HTMLInputElement;
    };
}*/

/**
 * Creates the html elements for the provided todo
 *
 * @param {Todo} todo the todo item
 * @returns
 */
const createTodo = ({ content, id }) => {
  const div = document.createElement("div");
  const checkbox = document.createElement("input");
  const label = document.createElement("label");

  checkbox.type = "checkbox";
  checkbox.name = id;
  checkbox.setAttribute("onclick", `checkboxHandler('${id}')`);

  label.textContent = content;
  label.setAttribute("class", "lbl");

  div.appendChild(checkbox);
  div.appendChild(label);
  return { div, checkbox, label };
};

/**
 * Handles checkbox click event
 * This will update our Todo#checked box property
 * Also will trigger the re-render method
 *
 * @param {string} id the todo item id
 */
const checkboxHandler = (id) => {
  todos.forEach((todo) => {
    if (todo.id === id) {
      todo.checked = !todo.checked;
      return;
    }
  });
  renderTodos();
};

/**
 * Re-renders any changes in the todo array.
 * This also changes the class attribute for
 * a todo item to get the strikethrough
 */
const renderTodos = () => {
  todos.forEach((todo) => {
    if (!todo.node) {
      todo.node = createTodo(todo);
      todoList.appendChild(todo.node.div);
    }

    const { label, checkbox } = todo.node;
    if (label.textContent !== todo.content) {
      label.textContent = todo.content;
    }

    if (checkbox.checked !== todo.checked) {
      checkbox.checked = todo.checked;
    }
    label.setAttribute("class", `lbl ${checkbox.checked ? "lbl-checked" : ""}`);
  });
};

/**
 * Handles the post todo button.
 * Creates a new Todo item with an incremental id
 * and adds it to our list. Afterwards trigger re-render.
 */
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const todoContent = todoInput.value;
  todoInput.value = "";

  if (!todoContent) {
    return;
  }

  const todo = {
    content: todoContent,
    checked: false,
    id: `todo-${counter++}`,
  };

  todos.push(todo);
  renderTodos();
});

/**
 * Handles the mark/clear all todos.
 * This changes the internal checked state of the todos
 * and will trigger a re-render
 *
 * @param {Event} event
 * @param {boolean} state
 */
const toggleAllBoxes = (event, state) => {
  event.preventDefault();
  todos.forEach((todo) => {
    todo.checked = state;
  });
  renderTodos();
};

/**
 * Adds listener to mark all todos
 */
markAllButton.addEventListener("click", (event) => {
  toggleAllBoxes(event, true);
});

/**
 * Adds listener to clear all todos
 */
clearButton.addEventListener("click", (event) => {
  toggleAllBoxes(event, false);
});

/**
 * Deletes all todos from the DOM and clears the array
 */
deleteButton.addEventListener("click", (event) => {
  event.preventDefault();
  todos = [];
  todoList.innerHTML = "";
});
