'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WxParse = require('../../static/utils/wxParse/wxParse.js');
var app = getApp();
exports.default = Page({
  data: {
    banner: [],
    id: '',
    current: 0,
    attributeToast: false,
    attribute_list: [],
    attribute_id: 0,
    price: '',
    num: 1,
    into_type: 1,
    play_btn_position: "center",
    stock: '',
    evaluation_list: [],
    share_id: 0
  },

  onLoad: function onLoad(e) {
    if (e.id) this.setData({
      id: e.id
      // id:1,
    });
    if (e.share_id) {
      this.setData({ share_id: e.share_id });
    }
    if (e.scene) {
      this.setData({ id: decodeURIComponent(e.scene) });
    }
    if (e.into_type) {
      this.setData({ into_type: e.into_type });
    }
  },
  moreEvaluation: function moreEvaluation() {
    wx.navigateTo({ url: '../evaluation/product_evaluation?data_type=1&product_id=' + this.data.id });
  },
  getProductEvaluation: function getProductEvaluation(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        product_id: that.data.id,
        data_type: 1,
        length: 3
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          evaluation_list: res.data.data.list,
          evaluation_total: res.data.data.total
        });
      }
    });
  },
  onShow: function onShow() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login?share_id=' + share_id });
    }
    this.getUserInfo();
    this.getProductEvaluation();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getDetail();
    wx.stopPullDownRefresh();
  },

  openToast: function openToast() {
    this.setData({ attributeToast: true });
  },
  getUserInfo: function getUserInfo() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        if (res.data.data == -1) {
          // wx.navigateTo({url: '../login/login',});
        }
        that.setData({
          user: res.data.data
        });
        wx.setStorageSync('user', res.data.data);
        that.getDetail();
      }
    });
  },
  selAttribute: function selAttribute(e) {
    console.log(e);
    var k = e.currentTarget.dataset.k;
    var v = e.currentTarget.dataset.v;
    var arr = this.data.attribute_list;
    for (var i = 0; i < arr.length; i++) {
      if (k == i) {
        arr[i].selected = 'attribute-item-selected';
        this.setData({
          price: v.price,
          attribute_id: v.id,
          stock: v.stock
        });
      } else {
        arr[i].selected = '';
      }
    }
    this.setData({ attribute_list: arr });
  },
  closeAttributeToast: function closeAttributeToast() {
    this.setData({ attributeToast: false });
  },
  toIndex: function toIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  },
  numInput: function numInput(e) {
    var n = e.detail.value;
    if (n < this.data.detail.can_buy_min) {
      wx.showToast({ title: '最低' + this.data.detail.can_buy_min + '件起购', icon: 'none' });return;
    }
    if (n > this.data.detail.can_buy_max) {
      wx.showToast({ title: '单次最多可买' + this.data.detail.can_buy_max + '件', icon: 'none' });return;
    }
    this.setData({
      num: n
    });
    console.log(e);
  },
  submit: function submit(e) {
    var t = e.currentTarget.dataset.t;
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });return;
    }
    if (this.data.attribute_list.length > 0) {
      if (t == 1) {
        this.setData({ attributeToast: true });
        return;
      }
      if (this.data.attribute_id == 0) {
        wx.showToast({ title: '请选择规格', icon: 'none' });
        this.setData({ attributeToast: true });
        return;
      }
    }

    if (this.data.num < 1) {
      wx.showToast({ title: '请输入下单数量', icon: 'none' });
      return;
    }

    if (this.data.num > this.data.stock) {
      wx.showToast({ title: '下单数量超过商品库存', icon: 'none' });
      return;
    }

    if (this.data.num < this.data.detail.can_buy_min) {
      wx.showToast({ title: '最低' + this.data.detail.can_buy_min + '件起购', icon: 'none' });return;
    }
    if (this.data.num > this.data.detail.can_buy_max) {
      wx.showToast({ title: '单次最多可买' + this.data.detail.can_buy_max + '件', icon: 'none' });return;
    }

    this.setData({ attributeToast: false });
    wx.navigateTo({
      url: '../order/submit?type=1&product_num=' + this.data.num + '&product_id=' + this.data.id + '&attribute_id=' + this.data.attribute_id + '&into_type=' + this.data.into_type
    });
  },
  toCar: function toCar() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '../login/login' });return;
    }
    wx.switchTab({ url: '../car/index' });
  },
  getDetail: function getDetail() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getProductDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.id
      },
      success: function success(res) {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res.data.data.name
        });
        that.setData({
          price: res.data.data.price,
          attribute_list: res.data.data.attribute_list,
          imgs: res.data.data.images,
          bannerCount: res.data.data.images.length,
          detail: res.data.data,
          content: res.data.data.detail,
          stock: res.data.data.stock,
          num: res.data.data.can_buy_min
        });

        WxParse.wxParse('article', 'html', res.data.data.detail, that, 5);
      }
    });
  },
  addCar: function addCar(e) {
    var t = e.currentTarget.dataset.t;
    if (this.data.attribute_list.length > 0) {
      if (t == 1) {
        this.setData({ attributeToast: true });
        return;
      }
      if (this.data.attribute_id == 0) {
        wx.showToast({ title: '请选择规格', icon: 'none' });
        this.setData({ attributeToast: true });
        return;
      }
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/addcar',
      data: {
        token: wx.getStorageSync('token'),
        product_id: that.data.id,
        type: 1,
        attribute_id: this.data.attribute_id,
        num: this.data.num
      },
      success: function success(res) {
        console.log(res);
        if (res.data.data > 0) {
          wx.showToast({ title: '已加入购物车' });
        }
      }
    });
  },
  toCollect: function toCollect() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/collectProduct',
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.id
      },
      success: function success(res) {
        console.log(res);
        that.getDetail();
      }
    });
  },
  bindchange: function bindchange(e) {
    this.setData({
      current: e.detail.current
    });
  },
  changeNum: function changeNum(e) {
    var t = e.currentTarget.dataset.t;
    var num = this.data.num;
    if (t == 1) {
      if (num == 1) {
        wx.showToast({ title: '无法再减', icon: 'none' });
        return;
      }
      num = parseInt(num) - 1;
    } else {
      num = parseInt(num) + 1;
    }
    if (num < this.data.detail.can_buy_min) {
      wx.showToast({ title: '最低' + this.data.detail.can_buy_min + '件起购', icon: 'none' });return;
    }
    if (num > this.data.detail.can_buy_max) {
      wx.showToast({ title: '单次最多可买' + this.data.detail.can_buy_max + '件', icon: 'none' });return;
    }
    this.setData({
      num: num
    });
  },
  previewPic: function previewPic(e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.dataset.v.src,
      urls: this.data.detail.banner
    });
  },


  onShareAppMessage: function onShareAppMessage() {
    var path = '/pages/product/detail?share_id=' + wx.getStorageSync('user').id + '&id=' + this.data.detail.id;
    console.log(path);
    return {
      title: this.data.detail.name,
      // desc: '我赠送你一张'+this.data.detail.name+'卡，快来领取吧',
      path: path
    };
  },

  onShareTimeline: function onShareTimeline() {}

});