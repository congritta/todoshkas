export default class Todoshka {
  constructor(id, name, description, dueDate) {
    this.isEditing = false;

    this.id = id;
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;

    this.htmlNode = document.createElement("div");
    this.htmlNode.setAttribute("data-id", this.id);
    this.htmlNode.classList.add("todoshka");

    this.parentNode = null;

    this.render();
  }

  mount(parentNode) {
    this.parentNode = parentNode;
    parentNode.appendChild(this.htmlNode);
  }

  render() {
    this.htmlNode.innerHTML = "";

    if (!this.isEditing) {
      const name = document.createElement("div");
      name.classList.add("name");
      name.appendChild(document.createTextNode(this.name));

      const description = document.createElement("div");
      description.classList.add("description");
      description.appendChild(document.createTextNode(this.description));

      const paramEls = [];
      [this.dueDate].forEach((_param) => {
        const param = document.createElement("div");
        param.classList.add("param");

        if (_param instanceof Date) {
          param.appendChild(document.createTextNode(_param.toLocaleString()));
        }
        else {
          param.appendChild(document.createTextNode(String(_param)));
        }

        paramEls.push(param);
      });

      const actionButtonsEl = document.createElement("div");
      actionButtonsEl.classList.add("action-buttons");

      const editButton = document.createElement("button");
      editButton.appendChild(document.createTextNode("Edit"));
      editButton.style.color = "dodgerblue";
      editButton.onclick = () => {
        this.isEditing = true;
        this.render();
      };

      const deleteButton = document.createElement("button");
      deleteButton.appendChild(document.createTextNode("Delete"));
      deleteButton.style.color = "red";
      deleteButton.onclick = () => this.deleteThis();

      actionButtonsEl.append(editButton, deleteButton);

      this.htmlNode.appendChild(name);
      this.htmlNode.appendChild(description);
      this.htmlNode.append(...paramEls);
      this.htmlNode.appendChild(actionButtonsEl);
    }

    else {
      const nameField = document.createElement("input");
      nameField.classList.add("name");
      nameField.setAttribute("type", "text");
      nameField.setAttribute("placeholder", "Todoshka name...");
      nameField.value = this.name;
      nameField.oninput = (e) => this.name = e.target.value;

      this.htmlNode.appendChild(nameField);

      const descriptionField = document.createElement("textarea");
      descriptionField.classList.add("description");
      descriptionField.setAttribute("placeholder", "Todoshka description...");
      descriptionField.value = this.description;
      descriptionField.oninput = (e) => this.description = e.target.value;

      this.htmlNode.appendChild(descriptionField);

      const actionButtonsEl = document.createElement("div");
      actionButtonsEl.classList.add("action-buttons");

      const saveButton = document.createElement("button");
      saveButton.appendChild(document.createTextNode("Save"));
      saveButton.style.color = "dodgerblue";
      saveButton.onclick = () => {
        this.isEditing = false;
        this.update();
        this.render();
      };

      const deleteButton = document.createElement("button");
      deleteButton.appendChild(document.createTextNode("Delete"));
      deleteButton.style.color = "red";
      deleteButton.onclick = () => this.deleteThis();

      actionButtonsEl.append(saveButton, deleteButton);

      this.htmlNode.appendChild(actionButtonsEl);
    }
  }

  update() {
    window.todoshkas[this.id] = this.export();
    localStorage.setItem("todoshkas", JSON.stringify(window.todoshkas));
  }

  deleteThis() {
    this.htmlNode.classList.add("_removing");

    setTimeout(() => {
      this.parentNode.removeChild(this.htmlNode);

      delete window.todoshkas[this.id];
      localStorage.setItem("todoshkas", JSON.stringify(window.todoshkas));
    }, 210);
  }

  export() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      dueDate: this.dueDate.toISOString()
    };
  }
}
