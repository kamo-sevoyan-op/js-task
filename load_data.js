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

function createCategoryContainer(entity){
  const container = document.createElement("div");
  container.setAttribute("class", "category-container");

  const role = entity.role;
  const level = entity.level;
  const languages = entity.languages;
  const tools = entity.tools;

  const roleElement = document.createElement("span");
  roleElement.innerText = role;
  roleElement.setAttribute("class", "role-element");
  container.append(roleElement);

  const levelElement = document.createElement("span");
  levelElement.innerText = level;

  for (let language of languages){
    const langElement = document.createElement("span");
    langElement.innerText = language;
    container.append(langElement);
  }
  
  for (let tool of tools){
    const toolElement = document.createElement("span");
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
  const categoryContainer = createCategoryContainer(entity);

  contentContainer.append(descriptionContainer);
  contentContainer.append(categoryContainer);

  container.append(contentContainer);
  container.setAttribute("data-is-new", entity.new);

  return container;
}

async function insertData(){

  const data = await loadData();
  const flexContainer = document.getElementById("job-list-container");

  for (let entity of data){
    const element = createElement(entity);
    flexContainer.append(element);
  }
}