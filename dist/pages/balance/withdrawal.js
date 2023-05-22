'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _data;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
exports.default = Page({
  data: (_data = {

    money: 0,
    withdrawal_type: [],
    withdrawal_type_index: -1,
    fp: ['我能提供发票', '我不能提供发票'],
    fp_index: 0,
    tel: '',
    yh: '',
    name: ''
  }, _defineProperty(_data, 'tel', ''), _defineProperty(_data, 'idnumber', ''), _defineProperty(_data, 'bank', ''), _defineProperty(_data, 'bank_card_number', ''), _defineProperty(_data, 'wx_account', ''), _defineProperty(_data, 'zfb_account', ''), _defineProperty(_data, 'user_type', 1), _defineProperty(_data, 'balance', 0), _defineProperty(_data, 'withdrawal_type', wx.getStorageSync('system_info').withdrawal_type), _defineProperty(_data, 'system_info', wx.getStorageSync('system_info')), _data),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (options.user_type) {
      this.setData({ user_type: options.user_type });
    } else {}
    if (!wx.getStorageSync('token')) {
      wx.showModal({ title: '提示', content: '登录后才可以操作哦', success: function success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '../../login/login' });
          } else if (res.cancel) {
            wx.navigateBack({ delta: 1 });
          }
        }
      });
      return;
    }
    this.setData({ user: wx.getStorageSync('user') });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    if (this.data.user_type == 1) {
      this.getUserInfo();
    } else {
      this.getMchInfo();
    }
    this.getUserInfo();
  },

  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          balance: res.data.data.balance
        });
      }
    });
  },
  getMchInfo: function getMchInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getMchDetail',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          balance: res.data.data.mch.balance
        });
      }
    });
  },
  tixian: function tixian() {
    if (!(this.data.money > 0)) {
      wx.showToast({ title: '请输入金额', icon: 'none' });return;
    }
    var m1 = parseFloat(this.data.money) * 100;
    var m2 = parseFloat(this.data.balance) * 100;
    console.log(m1, m2);
    if (m1 > m2) {
      wx.showToast({ title: '余额不足', icon: 'none' });return;
    }
    if (m1 < parseFloat(this.data.system_info.withdrawal_min) * 100) {
      wx.showToast({ title: '不能小于最低提现金额', icon: 'none' });return;
    }
    if (this.data.withdrawal_type_index == -1) {
      wx.showToast({ title: '请选择提现方式', icon: 'none' });return;
    }
    if (!this.data.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });return;
    }
    if (!this.data.tel) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });return;
    }
    if (this.data.withdrawal_type[this.data.withdrawal_type_index] == '支付宝线下打款' && !this.data.zfb_account) {
      wx.showToast({ title: '请输入支付宝账号', icon: 'none' });return;
    }
    if (this.data.withdrawal_type[this.data.withdrawal_type_index] == '银行卡线下打款' && !this.data.bank) {
      wx.showToast({ title: '请输入银行名称', icon: 'none' });return;
    }
    if (this.data.withdrawal_type[this.data.withdrawal_type_index] == '银行卡线下打款' && !this.data.bank_card_account) {
      wx.showToast({ title: '请输入银行账号', icon: 'none' });return;
    }

    wx.showLoading();
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/withdrawal',
      data: {
        token: wx.getStorageSync('token'),
        user_type: this.data.user_type,
        money: this.data.money,
        withdrawal_name: this.data.withdrawal_type[this.data.withdrawal_type_index],
        name: this.data.name,
        tel: this.data.tel,
        idnumber: this.data.idnumber,
        bank: this.data.bank,
        bank_card_account: this.data.bank_card_account,
        wx_account: this.data.wx_account,
        zfb_account: this.data.zfb_account,
        fp: this.data.fp_index
      },
      success: function success(res) {
        console.log(res);
        wx.navigateTo({ url: 'withdrawal_record' });
      }
    });
  },
  moneyRecord: function moneyRecord() {
    wx.navigateTo({
      url: './record'
    });
  },
  txrecord: function txrecord() {
    wx.navigateTo({
      url: 'withdrawal_record?user_type=' + this.data.user_type
    });
  },


  bindPickerChange: function bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      withdrawal_type_index: e.detail.value
    });
  },

  bindFpChange: function bindFpChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      fp_index: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  shuoming: function shuoming() {
    wx.navigateTo({
      url: '../article/detail?type=tixianshuoming'
    });
  },
  moneyInput: function moneyInput(e) {
    this.setData({
      money: e.detail.value
    });
  },
  nameInput: function nameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },
  idnumberInput: function idnumberInput(e) {
    this.setData({
      idnumber: e.detail.value
    });
  },
  telInput: function telInput(e) {
    this.setData({
      tel: e.detail.value
    });
  },
  bankInput: function bankInput(e) {
    this.setData({
      bank: e.detail.value
    });
  },
  bankCardAccountInput: function bankCardAccountInput(e) {
    this.setData({
      bank_card_account: e.detail.value
    });
  },
  wxAccountInput: function wxAccountInput(e) {
    this.setData({
      wx_account: e.detail.value
    });
  },
  zfbAccountInput: function zfbAccountInput(e) {
    this.setData({
      zfb_account: e.detail.value
    });
  }
});