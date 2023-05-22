'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {
    showQrcode: false,
    isCanJoin: false
  },

  onLoad: function onLoad(e) {
    if (e.scene) {
      this.setData({
        scene: decodeURIComponent(e.scene)
      });
    }
  },
  onShow: function onShow() {
    this.getUserInfo();
  },


  onPullDownRefresh: function onPullDownRefresh() {
    this.getUserInfo();
    wx.stopPullDownRefresh();
  },

  info: function info() {
    if (this.data.detail.user_id == wx.getStorageSync('user').id) {
      wx.navigateTo({ url: 'edit_team_info' });
    }
  },
  qrcode: function qrcode() {
    this.setData({ showQrcode: true });
  },
  closeQrcode: function closeQrcode() {
    this.setData({ showQrcode: false });
  },
  build: function build() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认创建团队吗？',
      success: function success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.createTeam();
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  createTeam: function createTeam() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/createTeam',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log('------------');
        console.log(res);
        that.getUserInfo();
      }
    });
  },
  initData: function initData(team_id) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getTeamInfo',
      data: {
        token: wx.getStorageSync('token'),
        team_id: team_id
      },
      success: function success(res) {
        console.log('------------');
        console.log(res);
        that.setData({
          detail: res.data.data,
          list: res.data.data.team_user
        });
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
        that.setData({ isCanJoin: false });
        if (res.data.data.team_id) {
          that.initData(res.data.data.team_id);
        } else {
          if (that.data.scene) {
            that.initData(that.data.scene);
            that.setData({ isCanJoin: true });
          }
        }
        wx.setStorageSync('user', res.data.data);
      }
    });
  },
  joinTeam: function joinTeam() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认加入团队吗？',
      success: function success(res) {
        if (res.confirm) {
          console.log('用户点击确定');

          app.util.request({
            'url': 'entry/wxapp/joinTeam',
            data: {
              token: wx.getStorageSync('token'),
              team_id: that.data.scene
            },
            success: function success(res) {
              that.getUserInfo();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
});