'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./static/utils/system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('./static/we/util.js');
exports.default = App({

  globalData: {},
  util: util,
  siteInfo: {
    uniacid: '1',
    acid: '1',
    multiid: '0',
    version: '1.0',
    siteroot: 'https://distribute.shop.lincec.top',
    design_method: '3',
    model: ''
  },
  onLaunch: function onLaunch() {
    _system2.default.attachInfo();
  },
  onShow: function onShow() {},
  onHide: function onHide() {}
});