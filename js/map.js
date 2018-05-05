'use strict';

var noticeElements = document.querySelectorAll('.notice fieldset');
var disabledNotice = function (inactive) {
  for (var i = 0; i < noticeElements.length; i++) {
    if (inactive) {
      noticeElements[i].setAttribute('disabled', 'disabled');
    } else {
      noticeElements[i].removeAttribute('disabled', 'disabled');
    }
  }
};
disabledNotice(true);

var listElement = document.querySelector('.map__pins');
var offerTemplate = document.querySelector('template').content;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var TYPERUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NUMBER = [1, 2, 3, 4, 5, 6, 7, 8];

var transformArray = function (array, deleteElement, rusType) {
  var index = Math.floor(Math.random() * array.length);
  if (rusType) {
    array[index] = TYPERUS[index];
  }
  return (deleteElement) ? array.splice(index, 1) : array[index];
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandomValue = function (min, max) {
  return Math.round(min + Math.random() * max);
};

var createElement = function () {
  var author = {
    avatar: 'img/avatars/user0' + transformArray(NUMBER, true)
  };
  var location = {
    x: getRandomValue(300, 600),
    y: getRandomValue(150, 350)
  };
  var offer = {
    title: transformArray(TITLE, true),
    address: location.x + ', ' + location.y,
    price: getRandomValue(1000, 999000),
    type: transformArray(TYPE, false, true),
    rooms: getRandomValue(1, 5),
    guests: getRandomValue(1, 10),
    checkin: transformArray(CHECK),
    checkout: transformArray(CHECK),
    features: FEATURES,
    description: '',
    photos: PHOTOS.sort(compareRandom)
  };
  return {author: author, location: location, offer: offer};
};

var renderPhoto = function (photoSrc) {
  var photoTemplate = offerTemplate.querySelector('.popup__photo');
  var photoElement = photoTemplate.cloneNode(false);
  photoElement.src = photoSrc;
  return photoElement;
};

var renderOffer = function (offers) {
  offers = createElement();
  var offerElement = offerTemplate.cloneNode(true);
  var mapPin = offerElement.querySelector('.map__pin');
  var mapCard = offerElement.querySelector('.popup');
  var closeCard = offerElement.querySelector('.popup__close');
  mapCard.classList.add('hidden');
  mapPin.classList.add('hidden');
  var onPopupEcsPress = function (evt) {
    if (evt.keyCode === 27) {
      mapCard.classList.add('hidden');
    }
  };
  mapPin.addEventListener('click', function () {
    mapCard.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEcsPress);
  });
  closeCard.addEventListener('click', function () {
    mapCard.classList.add('hidden');
  });

  mapPin.style.left = (offers.location.x - 25) + 'px';
  mapPin.style.top = (offers.location.y - 70) + 'px';
  offerElement.querySelector('.map__pin img').src = offers.author.avatar + '.png';
  offerElement.querySelector('.popup__title').textContent = offers.offer.title;
  offerElement.querySelector('.popup__text--address').textContent = offers.offer.address;
  offerElement.querySelector('.popup__text--price').textContent = offers.offer.price + ' Р/ночь';
  offerElement.querySelector('.popup__type').textContent = offers.offer.type;
  offerElement.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' комнаты для ' + offers.offer.rooms + ' гостей';
  offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers.offer.checkin + ', выезд до ' + offers.offer.checkout;
  offerElement.querySelector('.popup__description').textContent = offers.offer.description;
  offerElement.querySelector('.popup__avatar').src = offers.author.avatar + '.png';
  offerElement.querySelector('.popup__photo').classList.add('hidden');
  for (var i = 0; i < PHOTOS.length; i++) {
    offerElement.querySelector('.popup__photos').appendChild(renderPhoto(offers.offer.photos[i]));
  }
  for (var j = 0; j < (Math.random() * FEATURES.length); j++) {
    offerElement.querySelector('.popup__feature').remove();
  }
  return offerElement;
};

var documentFragment = function () {
  var offerAdv = [];
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 8; i++) {
    fragment.appendChild(renderOffer(offerAdv[i]));
  }
  listElement.appendChild(fragment);
};

var START = function () {
  var setup = document.querySelector('.map');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  var mapPins = document.querySelectorAll('.map__pin');
  setup.classList.remove('map--faded');
  disabledNotice(false);
  for (var j = 0; j < mapPins.length; j++) {
    mapPins[j].classList.remove('hidden');
  }
};

var setAttributes = function (elem, attrs) {
  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      elem.setAttribute(key, attrs[key]);
    }
  }
};

var userAddress = document.querySelector('#address');
userAddress.setAttribute('readonly', 'readonly');
var setupOpen = document.querySelector('.map__pin--main');
setupOpen.addEventListener('mouseup', START);
documentFragment();

var titleInput = document.querySelector('#title');
var priceInput = document.querySelector('#price');
setAttributes(titleInput, {'required': 'required', 'minlength': 30, 'maxlength': 100});
setAttributes(priceInput, {'required': 'required', 'max': 1000000});

var settingMinPrice = function (event) {
  var oldSelected = typeSelect.options.selectedIndex;
  typeSelect.options[oldSelected].removeAttribute('selected');
  if (event.target.value === 'bungalo') {
    setAttributes(priceInput, {'min': 0, 'placeholder': 0});
    event.target.options[0].setAttribute('selected', 'selected');
  } else if (event.target.value === 'flat') {
    setAttributes(priceInput, {'min': 1000, 'placeholder': 1000});
    event.target.options[1].setAttribute('selected', 'selected');
  } else if (event.target.value === 'house') {
    setAttributes(priceInput, {'min': 5000, 'placeholder': 5000});
    event.target.options[2].setAttribute('selected', 'selected');
  } else if (event.target.value === 'palace') {
    setAttributes(priceInput, {'min': 10000, 'placeholder': 10000});
    event.target.options[3].setAttribute('selected', 'selected');
  }
};
var typeSelect = document.querySelector('#type');
typeSelect.setAttribute('required', 'required');
typeSelect.addEventListener('change', settingMinPrice);

priceInput.addEventListener('input', function () {
  var selectedNow = typeSelect.options.selectedIndex;
  if (typeSelect.options[selectedNow].value === 'bungalo') {
    priceInput.setCustomValidity('');
  }
  if (typeSelect.options[selectedNow].value === 'flat') {
    if (event.target.value < 1000) {
      priceInput.setCustomValidity('Для Квартиры минимальная стоимость 1000');
    } else {
      priceInput.setCustomValidity('');
    }
  }
  if (typeSelect.options[selectedNow].value === 'house') {
    if (event.target.value < 5000) {
      priceInput.setCustomValidity('Для Дома минимальная стоимость 5000');
    } else {
      priceInput.setCustomValidity('');
    }
  }
  if (typeSelect.options[selectedNow].value === 'palace') {
    if (event.target.value < 10000) {
      priceInput.setCustomValidity('Для Дома минимальная стоимость 5000');
    } else {
      priceInput.setCustomValidity('');
    }
  }
});

var settingSelected = function (firstSelect, secondSelect) {
  var firstIndex = firstSelect.options.selectedIndex;
  var secondIndex = secondSelect.options.selectedIndex;
  secondSelect.options[secondIndex].removeAttribute('selected');
  secondSelect.options[firstIndex].setAttribute('selected', 'selected');
};
var timeinSelect = document.querySelector('#timein');
var timeoutSelect = document.querySelector('#timeout');
timeinSelect.addEventListener('change', function () {
  settingSelected(timeinSelect, timeoutSelect);
});
timeoutSelect.addEventListener('change', function () {
  settingSelected(timeoutSelect, timeinSelect);
});

var roomsSelect = document.querySelector('#room_number');
var capacitySelect = document.querySelector('#capacity');
roomsSelect.setAttribute('required', 'required');
capacitySelect.setAttribute('required', 'required');

var settingRooms = function () {
  if (event.target.value === '3') {
    capacitySelect.options[3].setAttribute('disabled', 'disabled');
  } else {
    for (var k = 0; k < capacitySelect.options.length; k++) {
      capacitySelect.options[k].setAttribute('disabled', 'disabled');
    }
    if (event.target.value === '1') {
      capacitySelect.options[2].removeAttribute('disabled');
    } else if (event.target.value === '2') {
      capacitySelect.options[1].removeAttribute('disabled');
      capacitySelect.options[2].removeAttribute('disabled');
    } else if (event.target.value === '100') {
      capacitySelect.options[3].removeAttribute('disabled');
    }
  }
};

var settingCapacity = function () {
  if (event.target.value === '3') {
    roomsSelect.options[3].setAttribute('disabled', 'disabled');
  } else {
    for (var k = 0; k < roomsSelect.options.length; k++) {
      roomsSelect.options[k].setAttribute('disabled', 'disabled');
    }
    if (event.target.value === '2') {
      roomsSelect.options[0].removeAttribute('disabled');
      roomsSelect.options[1].removeAttribute('disabled');
    } else if (event.target.value === '1') {
      roomsSelect.options[0].removeAttribute('disabled');
    } else if (event.target.value === '0') {
      roomsSelect.options[3].removeAttribute('disabled');
    }
  }
};

roomsSelect.addEventListener('change', settingRooms);
capacitySelect.addEventListener('change', settingCapacity);
