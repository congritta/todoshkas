import Todoshka from "./Todoshka.js";
import {generateId} from "./misc.js";

window.todoshkas = {};

window.onload = () => {
  const newTodoshkaFormEl = document.getElementById("newTodoshkaForm");
  const newTodoshkaNameInputEl = document.getElementById("newTodoshkaNameInput");
  const newTodoshkaDescriptionInputEl = document.getElementById("newTodoshkaDescriptionInput");
  const newTodoshkaDueDateInputEl = document.getElementById("newTodoshkaDueDateInput");
  const newTodoshkaDueTimeInputEl = document.getElementById("newTodoshkaDueTimeInput");

  const hidableInputsEl = document.getElementById("hidableInputs");

  const todoshkasListEl = document.getElementById("todoshkasList");

  // Show or hide new todoshka description input
  newTodoshkaNameInputEl.onfocus = () => {
    hidableInputsEl.classList.remove("_hidden");
  };

  function hideHidableInputs() {
    setTimeout(() => {
      if (
        document.activeElement !== newTodoshkaNameInputEl
        && !newTodoshkaNameInputEl.value
        && document.activeElement !== newTodoshkaDescriptionInputEl
        && !newTodoshkaDescriptionInputEl.value
        && document.activeElement !== newTodoshkaDueDateInputEl
        && !newTodoshkaDueDateInputEl.value
        && document.activeElement !== newTodoshkaDueTimeInputEl
        && !newTodoshkaDueTimeInputEl.value
      ) {
        hidableInputsEl.classList.add("_hidden");
      }
    }, 0);
  }

  newTodoshkaNameInputEl.onblur = hideHidableInputs;
  newTodoshkaDescriptionInputEl.onblur = hideHidableInputs;

  // On new todoshka form submit
  newTodoshkaFormEl.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const todoshkaId = generateId();
    const todoshkaName = formData.get("name");
    const todoshkaDescription = formData.get("description");
    const todoshkaDueDate = formData.get("dueDate");
    const todoshkaDueTime = formData.get("dueTime");
    let $todoshkaDueDate = new Date(`${todoshkaDueDate} ${todoshkaDueTime}:00`);
    $todoshkaDueDate = $todoshkaDueDate.toString() !== "Invalid Date" ? $todoshkaDueDate : new Date();

    if (!todoshkaName) return;

    const todoshka = new Todoshka(todoshkaId, todoshkaName, todoshkaDescription, $todoshkaDueDate);
    todoshka.mount(todoshkasListEl);

    todoshkas[todoshkaId] = todoshka.export();

    localStorage.setItem("todoshkas", JSON.stringify(todoshkas));
    newTodoshkaNameInputEl.value = "";
    newTodoshkaNameInputEl.focus();
  };

  // Load todoshkas from localstorage
  todoshkas = localStorage.getItem("todoshkas") ? JSON.parse(localStorage.getItem("todoshkas")) : {};
  Object.entries(todoshkas).forEach(([_, _todoshka]) => {
    const todoshka = new Todoshka(_todoshka.id, _todoshka.name, _todoshka.description, new Date(_todoshka.dueDate));
    todoshka.mount(todoshkasListEl);
  });

};
