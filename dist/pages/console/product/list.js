"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    nav_height: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    current: 0,
    tabStyle: {
      'color': '#333',
      'width:': '80px'
    },
    activeTabStyle: {
      'color': '#ff2a00',
      'border-right': '1px solid #ff2a00',
      'background-color': '#fff'
    },
    tabItems: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    height: wx.DEFAULT_CONTENT_HEIGHT,
    tabContents: [],
    tabContentData: [],
    goodsArr: []
  },

  onLoad: function onLoad(e) {},
  onShow: function onShow() {
    this.initData();
  },
  initData: function initData() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getCateAndProduct',
      data: {
        token: wx.getStorageSync('token'),
        mch_id: wx.getStorageSync('mch_info').id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          tabItems: res.data.data,
          tabContents: res.data.data,
          tabContentData: res.data.data[that.data.current],
          goodsArr: res.data.data[that.data.current].product_list
        });
      }
    });
  },
  evaluation: function evaluation(e) {
    wx.navigateTo({ url: '../../evaluation/product_evaluation?show_add_btn=1&data_type=1&product_id=' + e.currentTarget.dataset.id });
  },
  edit: function edit(e) {
    wx.navigateTo({ url: 'goods_edit?id=' + e.currentTarget.dataset.id });
  },
  add: function add() {
    wx.navigateTo({
      url: 'goods_edit'
    });
  },
  del: function del(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          app.util.request({
            'url': 'entry/wxapp/delMchGoods',
            data: {
              token: wx.getStorageSync('token'),
              id: e.currentTarget.dataset.id
            },
            success: function success(res) {
              that.initData();
              if (res.data.data == 1) {
                wx.showToast({
                  title: '已删除'
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },
  handleChange: function handleChange(e) {
    console.log(e);
    var index = e.detail.index;
    this.setData({
      current: index,
      goodsArr: this.data.tabContents[index].product_list
    });
  },

  onReady: function onReady() {
    // this.setData({
    //   tabContentData:this.data.tabContents[0]
    // })
  }
});