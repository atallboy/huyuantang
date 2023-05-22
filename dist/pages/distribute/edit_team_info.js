'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onLoad: function onLoad(e) {
    this.initData();
  },
  onShow: function onShow() {},
  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMyTeamInfo',
      data: {
        token: wx.getStorageSync('token'),
        team_id: wx.getStorageSync('user').team_id
      },
      success: function success(res) {
        console.log('------------');
        console.log(res);
        that.setData({
          detail: res.data.data
        });
      }
    });
  },
  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    if (e.detail.value.name == '') {
      wx.showToast({ title: '请输入团队名称' });return;
    }
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/editTeamInfo',
      data: {
        team_id: this.data.detail.id,
        token: wx.getStorageSync('token'),
        name: e.detail.value.name
      },
      success: function success(res) {
        console.log(res);
        wx.navigateBack();
      }
    });
  }
});