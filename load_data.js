async function loadData() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) {
      throw new Error("Failed to load file");
    }
    return await res.json();
  } catch (error) {
    return alert(error);
  }
}

function createOtherInfoElement(entity){

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

function createCompanyElement(entity){
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

  if (isNew){
    const isNewElement = document.createElement("span");
    isNewElement.innerText = "NEW!";
    isNewElement.setAttribute("class", "new-indicator");
    indicatorContainer.append(isNewElement);
  }

  if (isFeatured){
    const isFeaturedElement = document.createElement("span");
    isFeaturedElement.innerText = "FEATURED";
    isFeaturedElement.setAttribute("class", "featured-indicator");
    indicatorContainer.append(isFeaturedElement);
  }

  container.append(indicatorContainer);
  return container; 
}

function createDescriptionContainer(entity){
  
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

function createCategoryContainer(entity, root){
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
  for (let language of languages){
    const langElement = document.createElement("span");
    langElement.setAttribute("data-category-type", "languages");
    langElement.setAttribute("data-category-value", language);

    const values = root.getAttribute("data-languages");    
    if (values === ""){
      root.setAttribute("data-languages", language)
    } else {
      root.setAttribute("data-languages", `${values},${language}`);
    }
    langElement.innerText = language;
    container.append(langElement);
  }
  
  root.setAttribute("data-tools", "");
  for (let tool of tools){
    const toolElement = document.createElement("span");
    toolElement.setAttribute("data-category-type", "tools");
    toolElement.setAttribute("data-category-value", tool);

    const values = root.getAttribute("data-tools");
    if (values === ""){
      root.setAttribute("data-tools", tool)
    } else {
      root.setAttribute("data-tools", `${values},${tool}`);
    }

    toolElement.innerText = tool;
    container.append(toolElement);
  }

  return container;
}

function createElement(entity){
  const container = document.createElement("div");

  container.setAttribute("class", "job-entity");
  container.setAttribute("id", `entity_${entity.id}`);

  const image = document.createElement("img");
  image.setAttribute("src", entity.logo);
  image.setAttribute("alt", "ALT"); //TODO: change later

  container.append(image);

  const contentContainer = document.createElement("div");
  contentContainer.setAttribute("class", "content-container");
  const descriptionContainer = createDescriptionContainer(entity);
  const categoryContainer = createCategoryContainer(entity, container);
  categoryContainer.addEventListener("click", updateFilter);

  contentContainer.append(descriptionContainer);
  contentContainer.append(categoryContainer);

  container.append(contentContainer);
  container.setAttribute("data-is-new", entity.new);

  return container;
}

function removeFilter(event){

  event.stopImmediatePropagation();
  const parent = event.target.closest(".filter-element");

  const categoryType = parent.getAttribute("data-category-type");
  const categoryValue = parent.getAttribute("data-category-value");

  const filterContainer = document.getElementById("filter-container");
  const filterElementContainer = document.getElementById("filter-element-container");
  let filterValue = filterContainer.getAttribute(`data-${categoryType}`);

  const updatedValue = filterValue.replace(categoryValue, "").replace(",,", "");
  filterContainer.setAttribute(`data-${categoryType}`, updatedValue);
  
  parent.remove();
  if (filterElementContainer.children.length === 0){
    filterContainer.style.display = "none";
  }
  filterJobList();
}

function createFilterElement(categoryType, categoryValue){

  const element = document.createElement("div");
  element.setAttribute("class", "filter-element");

  const textContainer = document.createElement("span");
  textContainer.innerText = categoryValue;

  const iconContainer = document.createElement("div");
  iconContainer.setAttribute("class", "filter-element-remove");
  iconContainer.addEventListener("click", removeFilter);
  const icon = document.createElement("img");
  icon.setAttribute("src", "./images/icon-remove.svg");
  iconContainer.append(icon);

  element.append(textContainer);
  element.append(iconContainer);

  element.setAttribute("data-category-type", categoryType);
  element.setAttribute("data-category-value", categoryValue);

  return element;
}

function isSubsetOf(a, b){
  return a.length === 0 || a.every(value => b.includes(value));
}

function splitStringNormalized(str){
  return str === "" ? [] : str.split(",");
}

function isMatching(child, container){

  childRoles = child.getAttribute("data-role");
  childRoles = splitStringNormalized(childRoles);
  childLevels = child.getAttribute("data-level");
  childLevels = splitStringNormalized(childLevels);
  childLanguages = child.getAttribute("data-languages")
  childLanguages = splitStringNormalized(childLanguages);
  childTools = child.getAttribute("data-tools");
  childTools = splitStringNormalized(childTools);

  containerRoles = container.getAttribute("data-role");
  containerRoles = splitStringNormalized(containerRoles);
  containerLevels = container.getAttribute("data-level");
  containerLevels = splitStringNormalized(containerLevels);
  containerLanguages = container.getAttribute("data-languages");
  containerLanguages = splitStringNormalized(containerLanguages);
  containerTools = container.getAttribute("data-tools");
  containerTools = splitStringNormalized(containerTools);

  const roleMatch = isSubsetOf(containerRoles, childRoles);
  const levelMatch = isSubsetOf(containerLevels, childLevels);
  const languagesMatch = isSubsetOf(containerLanguages, childLanguages);
  const toolsMatch = isSubsetOf(containerTools, childTools);

  return roleMatch && levelMatch && languagesMatch && toolsMatch;
}

function filterJobList(){

  const container = document.getElementById("job-list-container");
  const filterContainer = document.getElementById("filter-container");
  
  for (let i = 1; i < container.children.length; i++){
    const child = container.children[i];

    if (!isMatching(child, filterContainer)) {
      child.style.display = "none";
    } else {
      child.style.display = "flex";
    }
  }
}

function updateFilter(event){

  if (event.target.tagName != "SPAN"){
    return;
  }
  
  const target = event.target;
  const categoryType = target.dataset.categoryType;
  const categoryValue = target.dataset.categoryValue;

  const filterContainer = document.getElementById("filter-container");
  filterContainer.style.display = "flex";
  const filterContainerCategoryValue = filterContainer.getAttribute(`data-${categoryType}`);

  if (filterContainerCategoryValue.includes(categoryValue)){
    return;
  }
  
  if (filterContainerCategoryValue === ""){
    filterContainer.setAttribute(`data-${categoryType}`, categoryValue);
  } else {
    filterContainer.setAttribute(`data-${categoryType}`, `${filterContainerCategoryValue},${categoryValue}`);
  }
  const filterElementContainer = document.getElementById("filter-element-container");
  const filterElement = createFilterElement(categoryType, categoryValue);
  filterElementContainer.append(filterElement);
  filterJobList();
}

function clearAllFilters(event) {

  const filterContainer = document.getElementById("filter-container");
  filterContainer.setAttribute("data-role", "");
  filterContainer.setAttribute("data-level", "");
  filterContainer.setAttribute("data-languages", "");
  filterContainer.setAttribute("data-tools", "");

  const filterElementContainer = document.getElementById("filter-element-container");

  while (filterElementContainer.firstChild) {
    filterElementContainer.removeChild(filterElementContainer.firstChild);
  }

  filterContainer.style.display = "none";
  filterJobList();
}

async function insertData(){

  const data = await loadData();
  const flexContainer = document.getElementById("job-list-container");
  const clearElement = document.getElementById("filter-clear");
  clearElement.addEventListener("click", clearAllFilters)

  for (let entity of data){
    const element = createElement(entity);
    flexContainer.append(element);
  }
}