'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    list: []
  },

  onLoad: function onLoad() {},
  onShow: function onShow() {
    this.getLiveList();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getLiveList();
    wx.stopPullDownRefresh();
  },

  tiRoom: function tiRoom(e) {
    var roomid = e.currentTarget.dataset.roomid;
    var customParams = encodeURIComponent(JSON.stringify({ path: 'pages/live/index', roomid: roomid }));
    wx.navigateTo({
      url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + roomid + '&custom_params=' + customParams
    });
  },
  getLiveList: function getLiveList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getLiveList',
      success: function success(res) {
        console.log(res);
        that.setData({
          list: res.data.data
        });
      }
    });
  }
});