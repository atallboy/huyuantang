'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    becomeToast: false,
    detail: {},
    condition_type: false
  },

  onLoad: function onLoad() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
  },
  onShow: function onShow() {
    this.getList();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getList();
    wx.stopPullDownRefresh();
  },

  detail: function detail(e) {
    wx.navigateTo({ url: 'agent_card_detail?id=' + e.currentTarget.dataset.item.id });
  },
  toBecome: function toBecome() {
    if (this.data.condition_type === false) {
      wx.showToast({ title: '请选择一种方式', icon: 'none' });return;
    }

    var item = this.data.detail.condition[this.data.condition_type];
    this.setData({ becomeToast: false });
    if (item.type == 1) {
      wx.navigateTo({
        url: '../balance/recharge?to_type=level_condition&amount=' + item.price + '&condition_id=' + item.id
      });
    }

    if (item.type == 2) {
      wx.navigateTo({
        url: '../order/submit?type=1&product_num=1&product_id=' + item.product_id
      });
    }
  },
  become: function become(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      becomeToast: true,
      detail: item,
      condition_type: false
    });
  },
  closeBecomeToast: function closeBecomeToast() {
    this.setData({
      becomeToast: false
    });
  },
  radioChange: function radioChange(e) {
    console.log(e);
    this.setData({
      condition_type: e.detail.value
    });
  },
  getList: function getList(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getUserLevelList',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data
        });
      }
    });
  }
});