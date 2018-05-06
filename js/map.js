'use strict';

var setup = document.querySelector('.map');
var setupOpen = document.querySelector('.map__pin--main');
var listElement = document.querySelector('.map__pins');

var userAddress = document.querySelector('#address');
var titleInput = document.querySelector('#title');
var priceInput = document.querySelector('#price');
var typeSelect = document.querySelector('#type');
var timeinSelect = document.querySelector('#timein');
var timeoutSelect = document.querySelector('#timeout');
var roomsSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'bungalo', 'house', 'palace'];
var TYPES_RUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECKS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var MIN_PRICES = [1000, 0, 5000, 10000];

var transformArray = function (array, deleteElement) {
  var index = Math.floor(Math.random() * array.length);
  return deleteElement ? array.splice(index, 1) : array[index];
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandomValue = function (min, max) {
  return Math.round(min + Math.random() * max);
};

var getRandomFeatures = function (arr) {
  return arr.slice(0, Math.round(Math.random() * arr.length));
};

var setAttributes = function (elem, attrs) {
  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      elem.setAttribute(key, attrs[key]);
    }
  }
};

var elementSelected = function (select) {
  var index = select.options.selectedIndex;
  return select.options[index].value;
};

var createArrayPopup = function () {
  var adverts = [];
  var locationX = '';
  var locationY = '';
  for (var i = 0; i < 8; i++) {
    locationX = getRandomValue(300, 600);
    locationY = getRandomValue(150, 350);
    var advert = {
      location: {
        x: locationX,
        y: locationY
      },
      author: {
        avatar: 'img/avatars/user0' + transformArray(NUMBERS, true)
      },
      offer: {
        title: transformArray(TITLES, true),
        address: locationX + ', ' + locationY,
        price: getRandomValue(1000, 999000),
        type: transformArray(TYPES_RUS),
        rooms: getRandomValue(1, 5),
        guests: getRandomValue(1, 10),
        checkin: transformArray(CHECKS),
        checkout: transformArray(CHECKS),
        features: getRandomFeatures(FEATURES),
        description: '',
        photos: PHOTOS.sort(compareRandom)
      }
    };
    adverts.push(advert);
  }
  return adverts;
};

var adverts = createArrayPopup();

var renderFeatures = function (features) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var newFeatures = document.createElement('li');
    newFeatures.setAttribute('class', 'popup__feature popup__feature--' + features[i]);
    fragment.appendChild(newFeatures);
  }
  return fragment;
};

var renderPhoto = function (arr) {
  var fragment = document.createDocumentFragment();
  document.querySelector('template').content.querySelector('.popup__photo').setAttribute('src', arr[0]);
  for (var i = 1; i < arr.length; i++) {
    var newPhoto = document.querySelector('template').content.querySelector('.popup__photo').cloneNode(true);
    newPhoto.setAttribute('src', arr[i]);
    fragment.appendChild(newPhoto);
  }
  return fragment;
};

var renderOffer = function (item) {
  var offerTemplate = document.querySelector('template').content.querySelector('.popup');
  var cardOffer = offerTemplate.cloneNode(true);
  cardOffer.querySelector('.popup__title').textContent = item.offer.title;
  cardOffer.querySelector('.popup__text--address').textContent = item.offer.address;
  cardOffer.querySelector('.popup__text--price').textContent = item.offer.price + ' Р/ночь';
  cardOffer.querySelector('.popup__type').textContent = item.offer.type;
  cardOffer.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.rooms + ' гостей';
  cardOffer.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  cardOffer.querySelector('.popup__features').textContent = '';
  cardOffer.querySelector('.popup__features').appendChild(renderFeatures(item.offer.features));
  cardOffer.querySelector('.popup__description').textContent = item.offer.description;
  cardOffer.querySelector('.popup__avatar').src = item.author.avatar + '.png';
  cardOffer.querySelector('.popup__photos').appendChild(renderPhoto(item.offer.photos));
  cardOffer.classList.add('hidden');
  return cardOffer;
};

// var closeCard = document.querySelector('.popup__close');
var onPopupEcsPress = function (evt) {
  if (evt.keyCode === 27) {
    document.querySelector('.map__card').classList.add('hidden');
  }
};
var openCard = function () {
  document.querySelector('.popup').classList.remove('hidden');
  document.addEventListener('keydown', onPopupEcsPress);
};

var renderPins = function (item) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPin = pinTemplate.cloneNode(true);
  mapPin.querySelector('img').setAttribute('src', item.author.avatar + '.png');
  mapPin.setAttribute('style', 'left: ' + item.location.x + 'px; ' + 'top:' + item.location.y + 'px;');

  mapPin.addEventListener('click', openCard);
  return mapPin;
};

var documentFragment = function () {
  for (var i = 0; i < 8; i++) {
    var pinFragment = document.createDocumentFragment();
    pinFragment.appendChild(renderPins(adverts[i]));
    listElement.appendChild(pinFragment);
    var cardFragment = document.createDocumentFragment();
    cardFragment.appendChild(renderOffer(adverts[i]));
    setup.insertBefore(cardFragment, document.querySelector('.map__filters-container'));
  }
};

var addDisabledNotice = function (inactive) {
  var noticeElements = document.querySelectorAll('.notice fieldset');
  for (var i = 0; i < noticeElements.length; i++) {
    if (inactive) {
      noticeElements[i].setAttribute('disabled', 'disabled');
    } else {
      noticeElements[i].removeAttribute('disabled', 'disabled');
    }
  }
};
addDisabledNotice(true);

var activateMap = function () {
  addDisabledNotice(false);
  documentFragment(adverts);
  setup.classList.remove('map--faded');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  setAttributes(titleInput, {'required': 'required', 'minlength': 30, 'maxlength': 100});
  setAttributes(priceInput, {'required': 'required', 'max': 1000000});
  userAddress.setAttribute('readonly', 'readonly');
  typeSelect.setAttribute('required', 'required');
  roomsSelect.setAttribute('required', 'required');
  capacitySelect.setAttribute('required', 'required');

};

setupOpen.addEventListener('mouseup', activateMap);

var settingMinPrice = function (event) {
  var evt = event.target;
  for (var i = 0; i < TYPES.length; i++) {
    evt.options[i].removeAttribute('selected');
    if (evt.value === TYPES[i]) {
      setAttributes(priceInput, {'min': MIN_PRICES[i], 'placeholder': MIN_PRICES[i]});
    }
  }
};

typeSelect.addEventListener('change', settingMinPrice);

priceInput.addEventListener('invalid', function () {
  var evt = event.target.value;
  for (var g = 0; g < TYPES.length; g++) {
    if (elementSelected(typeSelect) === TYPES[g]) {
      if (evt < MIN_PRICES[g]) {
        priceInput.setCustomValidity('Для выбраного типа жилья минимальная стоимость ' + MIN_PRICES[g]);
      } else {
        priceInput.setCustomValidity('');
      }
    }
  }
});


timeinSelect.addEventListener('change', function () {
  timeoutSelect.value = timeinSelect.value;
});
timeoutSelect.addEventListener('change', function () {
  timeinSelect.value = timeoutSelect.value;
});

var settingRooms = function () {
  var evt = event.target.value;
  if (evt === '3') {
    capacitySelect.options[3].setAttribute('disabled', 'disabled');
  } else {
    for (var k = 0; k < capacitySelect.options.length; k++) {
      capacitySelect.options[k].setAttribute('disabled', 'disabled');
    }
    if (evt === '1') {
      capacitySelect.options[2].removeAttribute('disabled');
    } else if (evt === '2') {
      capacitySelect.options[1].removeAttribute('disabled');
      capacitySelect.options[2].removeAttribute('disabled');
    } else if (evt === '100') {
      capacitySelect.options[3].removeAttribute('disabled');
    }
  }
};

var settingCapacity = function () {
  var evt = event.target.value;
  if (evt === '3') {
    roomsSelect.options[3].setAttribute('disabled', 'disabled');
  } else {
    for (var k = 0; k < roomsSelect.options.length; k++) {
      roomsSelect.options[k].setAttribute('disabled', 'disabled');
    }
    if (evt === '2') {
      roomsSelect.options[0].removeAttribute('disabled');
      roomsSelect.options[1].removeAttribute('disabled');
    } else if (evt === '1') {
      roomsSelect.options[0].removeAttribute('disabled');
    } else if (evt === '0') {
      roomsSelect.options[3].removeAttribute('disabled');
    }
  }
};

roomsSelect.addEventListener('change', settingRooms);
capacitySelect.addEventListener('change', settingCapacity);
