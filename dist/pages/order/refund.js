'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var siteinfo = getApp().siteInfo;
exports.default = Page({
  data: {
    tklx: ['请选择退款原因', '服务未开始', '服务质量不满意', '其它'],
    tklx_index: 0,
    tkyy: ['请选择退款原因', '不想要了', '卖家发错货', '做工瑕疵', '破损', '质量问题'],
    tkyy_index: 0,
    shzt: ['未收到货', '已收到货'],
    shzt_index: 0,
    money: '',
    remark: '',
    order: [],
    site: siteinfo.site,
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      id: options.order_id
      // id:12
    });

    this.initData();
  },

  initData: function initData(e) {
    console.log(e);

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getOrderDetail',
      data: { token: wx.getStorageSync('token'), id: this.data.id },
      success: function success(res) {
        console.log(res);
        that.setData({
          order: res.data.data
        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {},

  submit: function submit() {
    var that = this;

    if (this.data.tkyy_index == 0) {
      wx.showToast({ title: '请选择退款原因' });return;
    }
    if (this.data.money == '' || this.data.money > this.data.order.pay_money) {
      wx.showToast({ title: '请输入有效退款金额' });return;
    }

    app.util.request({
      'url': 'entry/wxapp/submitRefund',
      data: {
        token: wx.getStorageSync('token'),
        order_id: this.data.id,
        reason: this.data.tkyy[this.data.tkyy_index],
        // tkyy:this.data.tkyy_index,
        remark: this.data.remark,
        // shzt:this.data.shzt_index,
        money: this.data.money
        // imgs:this.data.imgs.join('&')
      },
      success: function success(res) {
        wx.showToast({
          title: '已提交申请'
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      }
    });
  },
  bindTklxChange: function bindTklxChange(e) {
    this.setData({
      tklx_index: e.detail.value
    });
  },
  bindTkyyChange: function bindTkyyChange(e) {
    this.setData({
      tkyy_index: e.detail.value
    });
  },
  bindShztChange: function bindShztChange(e) {
    this.setData({
      shzt_index: e.detail.value
    });
  },
  moneyInput: function moneyInput(e) {
    this.setData({
      money: e.detail.value
    });
  },
  smInput: function smInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  chooseImg: function chooseImg() {

    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // var url = app.util.url('entry/wxapp/uploadPic');
        wx.uploadFile({
          // url:url,
          url: siteinfo.site + "/app/index.php?i=" + siteinfo.uniacid + "&c=entry&a=wxapp&do=UploadPic&m=jzfw_lincec",
          filePath: tempFilePaths[0],
          name: 'file',
          success: function success(res) {
            console.log(res.data);
            //do something
            var imgs = that.data.imgs;
            imgs.push(res.data);
            that.setData({
              imgs: imgs
            });
          }
        });
      }
    });
  },
  doimg: function doimg(e) {

    console.log(e);
    var k = e.currentTarget.dataset.k;
    var arr = [];
    var that = this;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function success(res) {
        if (res.tapIndex == 0) {
          for (var i = 0; i < that.data.imgs.length; i++) {
            console.log(that.data.imgs[i]);

            if (i != k) {
              console.log(i, k);
              arr.push(that.data.imgs[i]);
            }
          }
          console.log(k);
          console.log(arr);
          that.setData({
            imgs: arr
          });
        }
      }
    });
  }
});