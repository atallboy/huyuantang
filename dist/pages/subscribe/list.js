'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = Page({
  data: {},

  onLoad: function onLoad() {
    this.getSubscribeList();
  },
  getSubscribeList: function getSubscribeList() {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/GetSubscribeList',
      data: { token: wx.getStorageSync('token') },
      success: function success(res) {
        console.log(res);
        that.setData({
          list1: res.data.data.list1,
          list2: res.data.data.list2
        });
      }
    });
  },
  subscribeMessage: function subscribeMessage(tpl_id) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/SubscribeMessage',
      data: {
        token: wx.getStorageSync('token'),
        tpl_id: tpl_id
      },
      success: function success(res) {
        console.log(res);
        that.getSubscribeList();
      }
    });
  },


  dingyue: function dingyue(e) {
    // let tmplId = 'HCxc0RutBvzCybHmC53n4SSnDA5ewVMlp-BxXxVLqA8';
    // let tmplId = 'Cyuv-xWFzv79B0VjSLY6ecKVWaP2zAcTX6XUQIrb9dU';
    // let tmplId = 'uRIgN2tZ2H7UpiOHwVPwiUQIMzcelQkxNO4WWtrakGE';
    console.log(e);
    var tmplId = e.currentTarget.dataset.tplid;
    var that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: function success(res) {
        console.log(res);
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          if (res.subscriptionsSetting.itemSettings && res.subscriptionsSetting.itemSettings[tmplId]) {
            var item = res.subscriptionsSetting.itemSettings[tmplId];
            if (item == "reject") {
              that.dingyueComfirm(tmplId);
            } else if (item == "accept") {
              console.log('提示：您已经开启订阅消息');
              that.dingyueComfirm(tmplId);
            } else if (item == "ban") {
              console.log('提示：您已经被后台封禁');
            }
          } else {
            that.dingyueComfirm(tmplId);
          }
        } else {
          that.dingyueComfirm(tmplId);
        }
      }
    });
  },

  dingyueComfirm: function dingyueComfirm(tmplId) {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success: function success(res) {
        console.log('-----------');
        console.log(res);
        if (res[tmplId] === 'accept') {
          wx.showToast({
            title: '订阅成功！',
            duration: 1000,
            success: function success(data) {
              //成功
              console.error(data);
              that.subscribeMessage(tmplId);
            }
          });
        } else if (res[tmplId] == "reject") {
          //引导用户，手动引导用户点击按钮，去设置页开启，## Modals是自定义组件
          wx.showModal({
            title: '订阅消息',
            content: '您当前拒绝接受消息通知，是否去开启',
            confirmText: '开启授权',
            confirmColor: '#345391',
            cancelText: '仍然拒绝',
            cancelColor: '#999999',
            success: function success(res) {
              wx.openSetting({
                success: function success(res) {
                  console.log(res.authSetting);
                  // res.authSetting = {
                  //   "scope.userInfo": true,
                  //   "scope.userLocation": true
                  // }
                },
                fail: function fail(err) {
                  //失败
                  console.error(err);
                }
              });
            }
          });
        }
      },
      fail: function fail(err) {
        //失败
        console.error(err);
      }
    });
  }

});