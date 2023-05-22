'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {},

  toWhere: function toWhere(e) {
    var act = e.currentTarget.dataset.act;
    console.log(act);

    if (act == 'base_info') {
      wx.navigateTo({ url: 'info_base' });
    }
    if (act == 'pic_info') {
      wx.navigateTo({ url: 'info_pic' });
    }
    if (act == 'account_info') {
      wx.navigateTo({ url: 'account' });
    }
  }
});