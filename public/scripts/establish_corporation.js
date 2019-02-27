const createCorporationsViews = function(document, corporations) {
  const corporationNames = corporations.map(corporation => corporation.name);
  return corporationNames.map(name => {
    const corporationView = document.createElement('div');
    corporationView.classList.add('inactive-corporation');
    corporationView.classList.add(getClassNameForCorporation(name));

    const iconAttributes = {
      className: 'corporation-icon',
      innerText: name[0]
    };

    const corporationIcon = createElement(document, 'p', iconAttributes);

    const nameAttributes = {
      className: 'inactive-corporation-name',
      innerText: name
    };
    const corporationName = createElement(document, 'p', nameAttributes);
    corporationView.appendChild(corporationIcon);
    corporationView.appendChild(corporationName);
    corporationView.onclick = foundSelectedCorporation.bind(null, name);
    return corporationView;
  });
};

const getEstablishCorporationOverlay = function(document) {
  return document.getElementById('establish-corporation-overlay');
};

const closeOverlay = function(document) {
  getEstablishCorporationOverlay(document).style.display = 'none';
};

const foundSelectedCorporation = function(corporationName) {
  closeOverlay(document);
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

const showEstablishCorporationPopup = function(document, corporations) {
  getEstablishCorporationOverlay(document).style.display = 'flex';

  const corporationsContainer = document.getElementById(
    'inactive-corporations-container'
  );

  const corporationsViews = createCorporationsViews(document, corporations);
  corporationsContainer.innerHTML = '';
  appendChildren(corporationsContainer, corporationsViews);
};
