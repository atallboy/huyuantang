'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var timeout = void 0,
    videoContext = void 0;
exports.default = Page({
  data: {
    id: 1,
    detail: {},
    recommend: [],
    cate_id: 0
  },

  onLoad: function onLoad(e) {
    if (e.id) {
      this.setData({ id: e.id });
    }
    this.getDetail();
    this.getList();
  },
  onShow: function onShow() {},


  onPullDownRefresh: function onPullDownRefresh() {
    this.getDetail();
    this.getList();
    wx.stopPullDownRefresh();
  },

  onReady: function onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  bindplay: function bindplay(e) {
    console.log(e);
  },
  detail: function detail(e) {
    this.setData({ id: e.currentTarget.dataset.id });
    this.getDetail();
    this.getList();
  },
  getDetail: function getDetail(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getVideoDetail',
      data: {
        token: wx.getStorageSync('token'),
        id: this.data.id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          detail: res.data.data
        });
      }
    });
  },
  getList: function getList(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getVideoList',
      data: {
        token: wx.getStorageSync('token'),
        video_id: this.data.id

      },
      success: function success(res) {
        console.log(res);
        that.setData({
          recommend: res.data.data
        });
      }
    });
  },
  onHide: function onHide() {
    console.log('pause');
    this.videoContext.pause();
  },
  onUnload: function onUnload() {
    console.log('timeout');
    clearTimeout(timeout);

    //  videoContext.exitBackgroundPlayback();
    this.videoContext.pause();
  }
});