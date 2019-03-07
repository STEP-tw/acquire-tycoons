const createCorporationsViews = function(
  document,
  corporations,
  onclickListener
) {
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
    corporationView.onclick = onclickListener.bind(null, name);
    return corporationView;
  });
};

const getSelectCorporationOverlay = function(document) {
  return document.getElementById('select-corporation-overlay');
};

const closeOverlay = function(document, id) {
  document.getElementById(id).style.display = 'none';
};

const handleSelectedCorporation = function(requestURL, corporationName) {
  const overlayId = 'select-corporation-overlay';
  closeOverlay(document, overlayId);
  fetch(requestURL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ corporationName })
  }).then(() => {
    fetchGameData(document);
  });
};

const showSelectCorporationPopup = function(
  onclickListener,
  popupHeading,
  document,
  corporations
) {
  getSelectCorporationOverlay(document).style.display = 'flex';

  const corporationsContainer = document.getElementById(
    'corporations-container'
  );

  const popupHeader = document.getElementById('popup-heading');
  popupHeader.innerText = popupHeading;

  const corporationsViews = createCorporationsViews(
    document,
    corporations,
    onclickListener
  );
  corporationsContainer.innerHTML = '';
  appendChildren(corporationsContainer, corporationsViews);
};
