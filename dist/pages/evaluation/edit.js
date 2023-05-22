'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var siteinfo = getApp().siteInfo;
exports.default = Page({
  data: {
    starResult1: '感觉怎么样，打个分吧',
    title: '来给我们评个分吧',
    star: 0,
    star1: 0,
    star2: 0,
    star3: 0,
    status: true,
    order_id: 0,
    detail: '',

    evaluation: {},
    product_list: [],
    imgs: [{}, {}]
  },

  onLoad: function onLoad(e) {
    this.setData({
      order_id: e.order_id
      // order_id:61,
    });
    this.initData();
  },
  detailInput: function detailInput(e) {
    var k = e.currentTarget.dataset.k;
    var str = 'product_list[' + k + '].content_1';
    this.setData(_defineProperty({}, str, e.detail.value));
  },
  delPic: function delPic(e) {
    var k = e.currentTarget.dataset.k;
    var k1 = e.currentTarget.dataset.k1;
    var arr = [];
    for (var i = 0; i < this.data.product_list[k].pic.length; i++) {
      if (i != k1) {
        arr.push(this.data.product_list[k].pic[i]);
      }
    }
    var str = 'product_list[' + k + '].pic';
    this.setData(_defineProperty({}, str, arr));
  },
  delVideo: function delVideo(e) {
    var k = e.currentTarget.dataset.k;
    var k1 = e.currentTarget.dataset.k1;
    var arr = [];
    for (var i = 0; i < this.data.product_list[k].video.length; i++) {
      if (i != k1) {
        arr.push(this.data.product_list[k].video[i]);
      }
    }
    var str = 'product_list[' + k + '].video';
    this.setData(_defineProperty({}, str, arr));
  },
  preImg: function preImg(e) {
    var src = e.currentTarget.dataset.src;
    var arr = e.currentTarget.dataset.srcarr;
    console.log(src);
    wx.previewImage({
      current: src,
      urls: arr
    });
  },
  submit: function submit(e) {
    console.log(e);
    var data = { score: '', content: '', pic: [], video: [] };
    var arr = [];

    for (var i = 0; i < this.data.product_list.length; i++) {
      if (this.data.product_list[i].score == 0) {
        wx.showToast({ title: '请对产品打分', icon: 'none' });return;
      }
      data = { product_id: this.data.product_list[i].id, score: this.data.product_list[i].score, content: this.data.product_list[i].content_1, pic: this.data.product_list[i].pic.join('&'), video: this.data.product_list[i].video.join('&') };
      arr.push(data);
    }
    if (this.data.evaluation.service == 0) {
      wx.showToast({ title: '请对服务打分', icon: 'none' });return;
    }
    if (this.data.evaluation.deliver == 0) {
      wx.showToast({ title: '请对物流打分', icon: 'none' });return;
    }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/submitOrderEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        order_id: that.data.order_id,
        product_evaluation: arr,
        service: this.data.evaluation.service,
        deliver: this.data.evaluation.deliver
      },
      success: function success(res) {
        console.log(res);
        that.initData();
        wx.showToast({
          title: '评价成功'
        });
      }
    });
  },
  initData: function initData(e) {
    console.log(e);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getOrderEvaluation',
      data: {
        token: wx.getStorageSync('token'),
        order_id: that.data.order_id
      },
      success: function success(res) {
        console.log(res);
        that.setData({
          product_list: res.data.data.product_list,
          evaluation: res.data.data.evaluation
        });
        if (res.data.data.evaluation.service > 0) {
          that.setData({ status: true });
        } else {
          that.setData({ status: false });
        }
      }
    });
  },
  productScore: function productScore(e) {
    var k = e.currentTarget.dataset.k;
    var str = 'product_list[' + k + '].score';
    var index = e.detail;
    this.setData(_defineProperty({}, str, index));
  },
  serviceScore: function serviceScore(e) {
    var str = 'evaluation.service';
    this.setData(_defineProperty({}, str, e.detail));
  },
  deliverScore: function deliverScore(e) {
    var str = 'evaluation.deliver';
    this.setData(_defineProperty({}, str, e.detail));
  },
  selPic: function selPic(e) {
    console.log(siteinfo);
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.toUpload(e, tempFilePaths[i]);
        }
        wx.hideLoading();
      }
    });
  },
  selVideo: function selVideo(e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function success(res) {
        console.log(res.tempFilePath);
        wx.showLoading();
        that.toUpload(e, res.tempFilePath);
        wx.hideLoading();
      }
    });
  },
  toUpload: function toUpload(e, file) {
    var that = this;
    var k = e.currentTarget.dataset.k;
    var pic = e.currentTarget.dataset.pic;
    var video = e.currentTarget.dataset.video;
    wx.uploadFile({
      url: siteinfo.siteroot + "/upload?i=" + siteinfo.uniacid + '&token=' + wx.getStorageSync('token'),
      filePath: file,
      name: 'file',
      formData: { return_type: 1 },
      success: function success(res) {
        var data = JSON.parse(res.data);
        if (data.data.file_type == 1) {
          var str = 'product_list[' + k + '].pic';
          pic.push(data.data.src);
          that.setData(_defineProperty({}, str, pic));
        }
        if (data.data.file_type == 2) {
          var _str = 'product_list[' + k + '].video';
          video.push(data.data.src);
          that.setData(_defineProperty({}, _str, video));
        }
      }
    });
  }
});