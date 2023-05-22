'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    id: 0,
    card_id: 0,
    share_id: 0,
    cdkey: '',
    becomeToast: false,
    detail: {},
    condition_type: false,
    e: {},
    can_get_cdkey: true
  },

  onLoad: function onLoad(e) {
    if (e.id) {
      this.setData({ id: e.id });
    };
    if (e.share_id) {
      this.setData({ id: e.share_id });
    };
    if (e.cdkey) {
      this.setData({ cdkey: e.cdkey });
    };
    this.setData({ e: e });
  },
  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login?share_id=' + this.data.e.share_id });
    }
    this.initData();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.initData();
    wx.stopPullDownRefresh();
  },

  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getLevelCardDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.e.id,
        share_id: this.data.e.share_id,
        e: this.data.e,
        cdkey: this.data.e.cdkey
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          detail: res.data.data
        });
        wx.setNavigationBarTitle({ title: res.data.data.name });
      }
    });
  },
  use: function use() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/becomeUserByCard',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.e.id
      },
      success: function success(res) {
        console.log(res);
        that.initData();
      }
    });
  },
  gain: function gain() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/gainLevelCard',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.e.id,
        share_id: this.data.e.share_id,
        cdkey: this.data.e.cdkey
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          can_get_cdkey: res.data.data.can_get_cdkey
        });
        that.initData();
      }
    });
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
    this.setData({
      becomeToast: true,
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


  onShareAppMessage: function onShareAppMessage() {
    var path = '/pages/member/agent_card_detail?st=111&share_id=' + wx.getStorageSync('user').id + '&id=' + this.data.detail.id + '&cdkey=' + this.data.detail.cdkey;
    console.log(path);
    this.setData({
      p: path
    });
    return {
      title: this.data.detail.name,
      desc: '我赠送你一张' + this.data.detail.name + '卡，快来领取吧',
      path: path
    };
  }

});