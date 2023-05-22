"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    system_info: wx.getStorageSync('system_info'),
    user: wx.getStorageSync('user'),
    setAreaAgentDialog: false,
    area_agent_region: ['', '', ''],
    picker_level: 'sub-district'
  },

  onLoad: function onLoad() {},

  onShow: function onShow() {
    this.setData({ system_info: wx.getStorageSync('system_info') });
    this.getUserInfo();
  },

  onPullDownRefresh: function onPullDownRefresh() {
    this.getUserInfo();
    wx.stopPullDownRefresh();
  },

  submitAreaAgent: function submitAreaAgent(e) {
    console.log(e);
    if (!e.detail.value.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });return;
    }
    if (!e.detail.value.tel) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });return;
    }
    if (!this.data.area_agent_region[0]) {
      wx.showToast({ title: '请选择地区', icon: 'none' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitAreaAgentInfo',
      data: {
        token: wx.getStorageSync('token'),
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        province: this.data.area_agent_region[0],
        city: this.data.area_agent_region[1],
        district: this.data.area_agent_region[2]
      },
      success: function success(res) {
        console.log(res);
        wx.showToast({ title: '提交成功，请等待平台审核', icon: 'none' });
        setTimeout(function () {
          that.getUserInfo();
          that.setData({
            setAreaAgentDialog: false
          });
        }, 1000);
      }
    });
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          user: res.data.data
        });
        wx.setStorageSync('user', res.data.data);
      }
    });
  },
  toLogin: function toLogin() {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  toOrder: function toOrder(e) {
    wx.navigateTo({ url: '../order/list?status=' + e.currentTarget.dataset.status });
  },
  toWhere: function toWhere(e) {
    var act = e.currentTarget.dataset.act;
    console.log(act);

    if (act == 'toMybalance') {
      wx.navigateTo({ url: '../balance/record' });
    }
    if (act == 'toLevelList') {
      wx.navigateTo({ url: '../member/level_list' });
    }
    if (act == 'toMyAgentCard') {
      wx.navigateTo({ url: '../member/agent_card' });
    }
    if (act == 'toMyFans') {
      wx.navigateTo({ url: '../member/fans_reward' });
    }
    if (act == 'toWithdrawalRecord') {
      wx.navigateTo({ url: '../balance/withdrawal_record' });
    }
    if (act == 'toQrcode') {
      wx.navigateTo({ url: 'qrcode' });
    }
    if (act == 'toMyDistributeRelation') {
      wx.navigateTo({ url: '../distribute/floor' });
    }
    if (act == 'toMyInvite') {
      wx.navigateTo({ url: '../distribute/invite_record' });
    }
    if (act == 'toMyTeam') {
      wx.navigateTo({ url: '../distribute/team' });
    }
    if (act == 'toMyCollect') {
      wx.navigateTo({ url: '../product/list?type=collect' });
    }
    if (act == 'toUserLevelInfo') {
      wx.navigateTo({ url: 'info' });
    }

    if (act == 'setAreaAgent') {
      this.setData({ setAreaAgentDialog: true });
    }

    if (act == 'toRegMch') {
      wx.navigateTo({ url: '../mch/info/register' });
    }
    if (act == 'toMchConsole') {
      wx.navigateTo({ url: '../mch/manage/console' });
    }

    if (act == 'toSubscribe') {
      wx.navigateTo({ url: '../subscribe/list' });
    }
    if (act == 'toConsoleProduct') {
      wx.navigateTo({ url: '../console/product/list' });
    }
  },
  closeAreaAgent: function closeAreaAgent() {
    this.setData({ setAreaAgentDialog: false });
  },
  myinfo: function myinfo() {
    wx.navigateTo({
      url: 'info'
    });
  },


  bindRegionChange: function bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      area_agent_region: e.detail.value
    });
  },

  focus_company: function focus_company() {
    wx.navigateTo({
      url: '../company/focus_list'
    });
  },
  company_list: function company_list() {
    wx.navigateTo({
      url: '../company/list'
    });
  },
  call: function call() {
    wx.makePhoneCall({
      phoneNumber: this.data.system_info.tel
    });
  }
});