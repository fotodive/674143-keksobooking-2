'use strict';
var userDialog = document.querySelector('.map');
userDialog.classList.remove('map--faded');

var similarListElement = document.querySelector('.map__pins');
var similarOfferTemplate = document.querySelector('template').content;

var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var TYPERUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NUMBER = [1, 2, 3, 4, 5, 6, 7, 8];

var rend = function (array, del, rus) {
  var index = Math.floor(Math.random() * array.length);
  if (rus) {
    array[index] = TYPERUS[index];
  }
  return (del) ? array.splice(index, 1) : array[index];
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var createElement = function () {
  var author = {
    avatar: 'img/avatars/user0' + rend(NUMBER, true)
  };
  var location = {
    x: Math.round(300 + Math.random() * 600),
    y: Math.round(150 + Math.random() * 350)
  };
  var offer = {
    title: rend(TITLE, true),
    address: location.x + ', ' + location.y,
    price: Math.round(1000 + Math.random() * 999000),
    type: rend(TYPE, false, true),
    rooms: Math.round(1 + Math.random() * 5),
    guests: Math.round(1 + Math.random() * 10),
    checkin: rend(CHECK),
    checkout: rend(CHECK),
    features: FEATURES,
    description: '',
    photos: PHOTOS.sort(compareRandom)
  };

  return {author: author, location: location, offer: offer};
};

var renderOffer = function (offers) {
  offers = createElement();
  var offerElement = similarOfferTemplate.cloneNode(true);

  offerElement.querySelector('.popup').style.left = offers.location.x + 'px';
  offerElement.querySelector('.popup').style.top = offers.location.y + 'px';

  offerElement.querySelector('.map__pin').style.left = (offers.location.x - 25) + 'px';
  offerElement.querySelector('.map__pin').style.top = (offers.location.y - 70) + 'px';
  offerElement.querySelector('.map__pin img').src = offers.author.avatar + '.png';
  offerElement.querySelector('.popup__title').textContent = offers.offer.title;
  offerElement.querySelector('.popup__text--address').textContent = offers.offer.address;
  offerElement.querySelector('.popup__text--price').textContent = offers.offer.price + ' Р/ночь';
  offerElement.querySelector('.popup__type').textContent = offers.offer.type;
  offerElement.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' комнаты для ' + offers.offer.rooms + ' гостей';
  offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers.offer.checkin + ', выезд до ' + offers.offer.checkout;
  offerElement.querySelector('.popup__description').textContent = offers.offer.description;
  offerElement.querySelector('.popup__avatar').src = offers.author.avatar + '.png';
  var nom = Math.floor(Math.random() * FEATURES.length);
  for (var j = 0; j < nom; j++) {
    offerElement.querySelector('.popup__feature').remove();
  }

  offerElement.querySelector('.popup__photo').src = offers.offer.photos[0];
  for (var i = 1; i < PHOTOS.length; i++) {
    var photoElement = offerElement.querySelector('.popup__photo').cloneNode(false);
    offerElement.querySelector('.popup__photo').src = offers.offer.photos[i];
    offerElement.querySelector('.popup__photos').appendChild(photoElement);
  }
  return offerElement;
};

var offerAdv = [];
var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  fragment.appendChild(renderOffer(offerAdv[i]));
}
similarListElement.appendChild(fragment);
