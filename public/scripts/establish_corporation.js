const createCorporationsHtml = function(corporations) {
  const corporationNames = corporations.map(corporation => corporation.name);
  return corporationNames
    .map(
      name =>
        `<button id="${name}-btn" class="${getClassNameForCorporation(name)} ${name}-btn"  
        onclick="foundSelectedCorporation('${name}')">${name}</button>`
    )
    .join('');
};

const closeOverlay = function(id) {
  document.getElementById(id).style.display = 'none';
  document.getElementById(id).style.zIndex = 1;
};

const foundSelectedCorporation = function(corporationName) {
  closeOverlay('found-corporation-overlay');
  fetch('/establish-corporation', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ corporationName })
  }).then(() => {
    fetchGameData(document);
  });
};

const foundCorporation = function(document, corporations) {
  document.getElementById('found-corporation-overlay').style.display = 'flex';
  document.getElementById('found-corporation-overlay').style.zIndex = 0;
  document.getElementById('found-corporation').style.display = 'flex';
  const corporationsHtml = createCorporationsHtml(corporations);
  document.getElementById('corporation-btns').innerHTML = corporationsHtml;
};
