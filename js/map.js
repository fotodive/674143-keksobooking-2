'use strict';

var noticeElements = document.querySelectorAll('.notice fieldset');
var disabledNotice = function (inactive) {
  for (var i = 0; i < noticeElements.length; i++) {
    if (inactive) {
      noticeElements[i].setAttribute('disabled', 'disabled');
    }
    noticeElements[i].removeAttribute('disabled', 'disabled');
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

var createElement = function () {
  var author = {
    avatar: 'img/avatars/user0' + transformArray(NUMBER, true)
  };
  var location = {
    x: Math.round(300 + Math.random() * 600),
    y: Math.round(150 + Math.random() * 350)
  };
  var offer = {
    title: transformArray(TITLE, true),
    address: location.x + ', ' + location.y,
    price: Math.round(1000 + Math.random() * 999000),
    type: transformArray(TYPE, false, true),
    rooms: Math.round(1 + Math.random() * 5),
    guests: Math.round(1 + Math.random() * 10),
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
  var mapPins = document.querySelectorAll('.map__pin');
  setup.classList.remove('map--faded');
  disabledNotice(false);
  for (var j = 0; j < mapPins.length; j++) {
    mapPins[j].classList.remove('hidden');
  }
};

var userAddress = document.getElementById('address');
userAddress.setAttribute('readonly', 'readonly');
var setupOpen = document.querySelector('.map__pin--main');
setupOpen.addEventListener('mouseup', START);
documentFragment();
