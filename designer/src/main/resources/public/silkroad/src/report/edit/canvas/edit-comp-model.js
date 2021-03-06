/**
 * @file
 * @author 赵晓强(v_zhaoxiaoqiang@baidu.com)
 * @date 2014-8-14
 */
define(['url'], function (Url) {

    return Backbone.Model.extend({
        /**
         * 构造函数
         *
         * @param {Onject} option 初始化参数
         * @param {Object} option.canvasModel
         * @param {Object} option.reportId
         * @constructor
         */
        initialize: function (option) {
            this.canvasModel = option.canvasModel;
            this.reportId = option.reportId;
        },

        /**
         * 获取组件的数据关联配置（指标、维度、切片）
         *
         * @param {string} compId 组件id
         * @param {Function} success 数据load完成后的回调函数
         * @public
         */
        getCompAxis: function (compId, success) {
            var that = this;

            $.ajax({
                url: Url.getCompAxis(that.reportId, compId),
                success: function (data) {
                    success(data.data);
                }
            });
        },

        /**
         * 添加组件的数据关联配置（指标、维度、切片）
         *
         * @param {string} compId 组件id
         * @param {Object} data 需要发给服务器的表单数据
         * @param {Function} success 数据load完成后的回调函数
         * @public
         */
        addCompAxis: function (compId, data, success) {
            var that = this;

            $.ajax({
                url: Url.addCompAxis(that.reportId, compId),
                data: data,
                type: 'POST',
                success: function (data) {
                    success(data.data.id);
                }
            });
        },

        /**
         * 删除组件的数据关联配置（指标、维度、切片）
         *
         * @param {string} compId 组件id
         * @param {string} axisType 数据轴类型
         * @param {string} olapId 数据项Id
         * @param {Function} success 交互完成后的回调函数
         * @public
         */
        deleteCompAxis: function (compId, axisType, olapId, success) {
            $.ajax({
                url: Url.deleteCompAxis(this.reportId, compId, olapId, axisType),
                type: 'DELETE',
                success: function () {
                    success();
                }
            });
        },

        /**
         * 通过id获取json中的组件配置信息
         *
         * @param {string} compId
         * @return {Array} arr 配置信息
         */
        getCompDataById: function (compId) {
            var entityDefs = this.canvasModel.reportJson.entityDefs;
            var arr = [];

            for (var i = 0, len = entityDefs.length; i < len; i++) {
                if (entityDefs[i].compId == compId) {
                    arr.push(entityDefs[i]);
                }
            }
            return arr;
        },

        /**
         * 更新日历组件的json配置
         *
         * @param {Array} data 日历显示配置数据
         * @param {function} success 处理完的回调函数
         * @public
         */
        updateCalendarJson: function (data, success) {
            var compBoxModel = this.canvasModel.compBoxModel;
            var calendarModel = compBoxModel.getComponentData('TIME_COMP');
            var compJson = this.getCompDataById(this.compId)[0];
            var config = calendarModel.switchConfig(data);

            compJson.dataSetOpt.timeTypeList = config.timeTypeList;
            compJson.dataSetOpt.timeTypeOpt = config.timeTypeOpt;
            this.canvasModel.saveJsonVm(success);
        },

        /**
         * 调整组件数据项的顺序
         *
         * @param {string} compId 组件Id
         * @param {Ojbect} data 收集完成的数据，传给后台
         * @param {Function} success 回调函数
         * @public
         */
         sortingCompDataItem: function (compId, data, success) {
            $.ajax({
                url: Url.sortingCompDataItem(this.reportId, compId),
                type: 'POST',
                data: data,
                success: function () {
                    success();
                }
            });
        }
    });
});