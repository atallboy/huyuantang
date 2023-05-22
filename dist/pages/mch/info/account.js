'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var siteinfo = getApp().siteInfo;
exports.default = Page({
  data: {
    mch_id: 0,
    step: 1,
    detail: [],
    cateArr: [],
    cateIndex: -1,
    province: '',
    city: '',
    district: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    mch_cate: [],
    agree_declaration: false,
    host: siteinfo.siteroot
  },

  changDecalation: function changDecalation(e) {
    console.log(e);this.setData({ agree_declaration: !this.data.agree_declaration });
  },
  onLoad: function onLoad(e) {
    qqmapsdk = new QQMapWX({
      key: 'KHABZ-MEULF-GGWJE-NUL5G-4TGFT-4VFT4'
    });
    this.getMchCate();
    this.getMchDetail();
  },
  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });
    }
  },
  copy: function copy() {
    wx.setClipboardData({
      data: this.data.host + '/login',
      success: function success(res) {
        wx.getClipboardData({
          success: function success(res) {
            console.log(res.data); // data
            wx.showToast({ title: '复制成功' });
          }
        });
      }
    });
  },
  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    if (e.detail.value.account == '') {
      wx.showToast({ title: '请输入登录账号', icon: 'none' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/editMchAccount',
      data: {
        mch_id: wx.getStorageSync('user').mch_id,
        token: wx.getStorageSync('token'),
        account: e.detail.value.account,
        password: e.detail.value.password
      },
      success: function success(res) {
        console.log(res);
        wx.showToast({ title: '保存成功' });
        // that.getMchDetail();           
      }
    });
  },
  getMchDetail: function getMchDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMchDetail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log(res);
        if (res.data.data.step != 1) {
          that.setData({
            account_info: res.data.data.account_info
          });
        }
      }
    });
  }
});