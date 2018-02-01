
import face from './face/face';
import marker from './marker/marker';
import render from './render';

const vconsole = require('vconsole');

new vconsole();

switch (window.location.search) {
  case '?face': face(); break;
  case '?marker': marker(); break;
  default: render();
}
