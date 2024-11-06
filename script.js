const STATE = {
  filters: {},
  data: []
}

async function initializeState() {

  STATE.filters = {
    role: new Set([]),
    level: new Set([]),
    languages: new Set([]),
    tools: new Set([])
  }

  const data = await loadData();
  STATE.data = data;

  const joblistContainer = document.getElementById("job-list-container");

  for (let entity of data) {
    const element = createElement(entity);
    joblistContainer.append(element);
  }

}

async function loadData() {

  try {
    const result = await fetch("./data.json");
    if (!result.ok) {
      throw new Error("Failed to load file");
    }
    return await result.json();
  } catch (error) {
    return console.log(error);
  }
}

function addFilter(event) {

  if (event.target.tagName != "SPAN") {
    return;
  }

  const target = event.target;
  const categoryType = target.dataset.categoryType;
  const categoryValue = target.dataset.categoryValue;

  STATE.filters[categoryType].add(categoryValue);
  updateLayout();
}

function removeFilter(event) {

  event.stopImmediatePropagation();
  const target = event.target.closest(".filter-element");
  const categoryType = target.dataset.categoryType;
  const categoryValue = target.dataset.categoryValue;

  STATE.filters[categoryType].delete(categoryValue);

  updateLayout();
}

function clearAllFilters(event) {
  Object.values(STATE.filters).forEach((x) => x.clear());
  updateLayout();
}

function matchFilters(entity) {
  for (const category in STATE.filters) {
    for (const type of STATE.filters[category]) {
      if (!entity[category].includes(type)) {
        return false;
      }
    }
  }

  return true;
}

function eraseOldLayout() {
  const joblistContainer = document.getElementById("job-list-container");

  while (joblistContainer.firstChild) {
    joblistContainer.removeChild(joblistContainer.firstChild);
  }
  const filterContainer = document.getElementById("filter-container");
  filterContainer?.remove();

}

function updateLayout() {

  eraseOldLayout();

  const joblistContainer = document.getElementById("job-list-container");

  for (const entity of STATE.data) {
    if (matchFilters(entity)) {
      const element = createElement(entity);
      joblistContainer.append(element);
    }
  }
  if (Object.values(STATE.filters).some((category) => category.size > 0)) {
    createFilterContainer();
  }
}

function createFilterContainer() {

  const filterContainer = document.createElement("div");
  filterContainer.setAttribute("id", "filter-container");
  const joblistContainer = document.getElementById("job-list-container");
  joblistContainer.append(filterContainer);


  const filterElementContainer = document.createElement("div");
  filterElementContainer.setAttribute("id", "filter-element-container");

  const clearElement = document.createElement("div");
  clearElement.innerText = "Clear";
  clearElement.setAttribute("id", "filter-clear");
  clearElement.addEventListener("click", clearAllFilters);

  filterContainer.append(filterElementContainer);
  filterContainer.append(clearElement);


  for (const categoryType in STATE.filters) {
    for (const categoryValue of STATE.filters[categoryType]) {
      const filterElement = createFilterElement(categoryType, categoryValue);
      filterElementContainer.append(filterElement);
    }
  }
}

function createFilterElement(categoryType, categoryValue) {

  const element = document.createElement("div");
  element.setAttribute("class", "filter-element");

  const textContainer = document.createElement("span");
  textContainer.innerText = categoryValue;

  const iconContainer = document.createElement("div");
  iconContainer.setAttribute("class", "filter-element-remove");
  iconContainer.addEventListener("click", removeFilter);
  const icon = document.createElement("img");
  icon.setAttribute("src", "./assets/icons/icon-remove.svg");
  iconContainer.append(icon);

  element.append(textContainer);
  element.append(iconContainer);

  element.setAttribute("data-category-type", categoryType);
  element.setAttribute("data-category-value", categoryValue);

  return element;
}

function createOtherInfoElement(entity) {

  const container = document.createElement("div");
  container.setAttribute("class", "other-info");

  const postedAt = entity.postedAt;
  const postedAtElement = document.createElement("span");
  postedAtElement.innerText = postedAt;

  const contractType = entity.contract;
  const contractTypeElement = document.createElement("span");
  contractTypeElement.innerText = contractType;

  const location = entity.location;
  const locationElement = document.createElement("span");
  locationElement.innerText = location;

  container.append(postedAtElement);
  container.append(contractTypeElement);
  container.append(locationElement);

  return container;
}

function createCompanyElement(entity) {

  const container = document.createElement("div");
  container.setAttribute("class", "company-description")

  const isNew = entity.new;
  const isFeatured = entity.featured;

  const companyName = entity.company;
  const companyNameElement = document.createElement("span");
  companyNameElement.setAttribute("class", "company-name");
  companyNameElement.innerText = companyName;

  container.append(companyNameElement);

  const indicatorContainer = document.createElement("div");
  indicatorContainer.setAttribute("class", "new-featured");

  if (isNew) {
    const isNewElement = document.createElement("span");
    isNewElement.innerText = "NEW!";
    isNewElement.setAttribute("class", "new-indicator");
    indicatorContainer.append(isNewElement);
  }

  if (isFeatured) {
    const isFeaturedElement = document.createElement("span");
    isFeaturedElement.innerText = "FEATURED";
    isFeaturedElement.setAttribute("class", "featured-indicator");
    indicatorContainer.append(isFeaturedElement);
  }

  container.append(indicatorContainer);
  return container;
}

function createDescriptionContainer(entity) {

  const container = document.createElement("div");
  container.setAttribute("class", "job-description");

  const position = entity.position;
  const positionElement = document.createElement("div");
  positionElement.setAttribute("class", "position");
  positionElement.innerText = position;

  const otherInfoElement = createOtherInfoElement(entity);
  const companyNameElement = createCompanyElement(entity);

  container.append(companyNameElement);
  container.append(positionElement);
  container.append(otherInfoElement);

  return container;
}

function createCategoryContainer(entity, root) {

  const container = document.createElement("div");
  container.setAttribute("class", "category-container");

  const role = entity.role;
  const level = entity.level;
  const languages = entity.languages;
  const tools = entity.tools;

  const roleElement = document.createElement("span");
  roleElement.setAttribute("data-category-type", "role");
  roleElement.setAttribute("data-category-value", role);
  root.setAttribute("data-role", role);
  roleElement.innerText = role;
  roleElement.setAttribute("class", "role-element");
  container.append(roleElement);

  const levelElement = document.createElement("span");
  levelElement.setAttribute("data-category-type", "level");
  levelElement.setAttribute("data-category-value", level);
  root.setAttribute("data-level", level);
  levelElement.innerText = level;
  container.append(levelElement);

  root.setAttribute("data-languages", "");
  for (let language of languages) {
    const langElement = document.createElement("span");
    langElement.setAttribute("data-category-type", "languages");
    langElement.setAttribute("data-category-value", language);

    const values = root.getAttribute("data-languages");
    if (values === "") {
      root.setAttribute("data-languages", language)
    } else {
      root.setAttribute("data-languages", `${values},${language}`);
    }
    langElement.innerText = language;
    container.append(langElement);
  }

  root.setAttribute("data-tools", "");
  for (let tool of tools) {
    const toolElement = document.createElement("span");
    toolElement.setAttribute("data-category-type", "tools");
    toolElement.setAttribute("data-category-value", tool);

    const values = root.getAttribute("data-tools");
    if (values === "") {
      root.setAttribute("data-tools", tool)
    } else {
      root.setAttribute("data-tools", `${values},${tool}`);
    }

    toolElement.innerText = tool;
    container.append(toolElement);
  }

  return container;
}

function createElement(entity) {

  const container = document.createElement("div");

  container.setAttribute("class", "job-entity");
  container.setAttribute("id", `entity_${entity.id}`);

  const image = document.createElement("img");
  image.setAttribute("src", entity.logo);
  image.setAttribute("alt", "Company logo");

  container.append(image);

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("class", "content-container");
  const descriptionContainer = createDescriptionContainer(entity);
  const categoryContainer = createCategoryContainer(entity, container);
  categoryContainer.addEventListener("click", addFilter);

  contentContainer.append(descriptionContainer);
  contentContainer.append(categoryContainer);

  container.append(contentContainer);
  container.setAttribute("data-is-new", entity.new);

  return container;
}