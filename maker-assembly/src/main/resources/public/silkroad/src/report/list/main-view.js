/**
 * @file 报表列表 - view
 * @author 赵晓强(v_zhaoxiaoqiang@baidu.com)
 * @date 2014-7-17
 */
define([
        'template',
        'dialog',
        'report/list/main-model',
        'report/list/main-template',
        'report/list/set-name-template',
        'report/report-view'
    ],
    function (
        template,
        dialog,
        MainModel,
        mainTemplate,
        setNameTemplate,
        ReportView
    ) {

        return Backbone.View.extend({
            // view事件绑定
            events: {
                'click .j-add-report': 'addReport',
                'click .j-show-publish-info': 'showPublishInfo',
                'click .j-delete-report': 'deleteReport',
                'click .j-edit-report': 'editReport',
                'click .j-copy-report': 'copyReport',
                'click .j-show-report': 'showReport'
            },

            /**
             * 构造函数
             *
             * @constructor
             */
            initialize: function () {
                var that = this;

                that.model = new MainModel();
                that.reportView = new ReportView();
                that.listenTo(
                    that.model,
                    'change:reportList',
                    function (model, data) {
                        if (data == null) {
                            // alert('未登录，需要前端支持弹窗跳转(功能待完善)');
                            dialog.showDialog({
                                dialog: {
                                    resizable: false,
                                    buttons: {
                                        "确定": function () {
                                            location.href = 'home.html';
                                        }
                                    },
                                    close: function () {
                                        location.href = 'home.html';
                                    }
                                },
                                content: '<a href = "home.html" target="_blank" style="color: #0066cc;">未登录，需要前端支持弹窗跳转(功能待完善)</a>',
                                title: '错误登录'
                            });
                            return ;
                        }

                        that.$el.html(
                            mainTemplate.render({
                                reportList: data
                            })
                        );
                    }
                );

                this.model.loadReportList();
                window.dataInsight.main = this;
            },

            /**
             * 添加报表
             *
             * @public
             */
            addReport: function () {
                var that = this;

                this.openSetNameDialog({
                    title: '添加报表',
                    data: {
                        text: '报表名称'
                    },
                    submit: function (dialog) {
                        var $this = $(dialog);
                        var name = $this.find('.j-report-name').val();

                        if (name == '') {
                            $this.find('.j-validation').html('名称不能为空').show();
                        }
                        else {
                            that.model.addReport(name, function (reportId) {
                                    $this.dialog('close');
                                    // 跳到下一步
                                    require(['report/set-cube/cube-view'],
                                        function (setCubeView) {
                                            window.dataInsight.main.destroy();
                                            new setCubeView({
                                                el: $('.j-main'),
                                                id: reportId
                                            });
                                        });
                                },
                                function (statusInfo) {
                                    $this.find('.j-validation').html(statusInfo).show();
                                }
                            );
                        }
                    }
                });
            },

            /**
             * 编辑报表
             *
             * @param {event} event 点击事件
             * @public
             */
            editReport: function (event) {
                var reportId = this.getLineId(event);
                var that = this;

                require(
                    ['report/edit/main-view'],
                    function (EditReportView) {
                        that.destroy();
                        new EditReportView({
                            el: $('.j-main'),
                            id: reportId,
                            isEdit: true
                        });
                    }
                );
            },

            /**
             * 预览报表
             *
             * @param {event} event 点击事件
             * @public
             */
            showReport: function (event) {
                var that = this;
                var reportId = this.getLineId(event);
                that.model.showReport(reportId, function (url) {
                    window.open(url, "_blank", left=0, top=0);
                });
            },

            /**
             * 删除报表
             *
             * @param {event} event 点击事件
             * @public
             */
            deleteReport: function (event) {
                var that = this;
                var reportId = this.getLineId(event);

                dialog.confirm('是否确定删除当前报表', function () {
                    that.model.deleteReport(reportId);
                });
            },

            /**
             * 复制报表（创建报表副本）
             *
             * @param {event} event 点击事件
             * @public
             */
            copyReport: function (event) {
                var that = this;
                var reportId = this.getLineId(event);
                this.openSetNameDialog({
                    title: '添加报表',
                    data: {
                        text: '请给新表单命名',
                        name: this.getNameById(reportId) + ' - 副本'
                    },
                    submit: function (dialog) {
                        var $this = $(dialog);
                        var name = $this.find('.j-report-name').val().trim();
                        if (name == '') {
                            $this.find('.j-validation').html('名称不能为空').show();
                        }
                        else {
                            that.model.copyReport(
                                reportId,
                                name,
                                function () {
                                    $this.dialog('close');
                                },
                                function (statusInfo) {
                                    $this.find('.j-validation').html(statusInfo).show();
                                });
                        }
                    }
                });
            },

            /**
             * 获取被点击的行的reportId
             *
             * @param {event} event 点击事件
             * @public
             * @return {string} 报表id
             */
            getLineId: function (event) {
                return $(event.target).parents('.j-root-line').attr('data-id');
            },

            /**
             * 打开设置报表名称的对话框
             *
             * @param {Object} option 配置项
             * @public
             */
            openSetNameDialog: function (option) {
                var that = this;

                dialog.showDialog({
                    title: option.title,
                    content: setNameTemplate.render(option.data),
                    dialog: {
                        width: 300,
                        height: 249,
                        open: function () {
                            var $this = $(this);
                            $this.find('.j-report-name').focus(function () {
                                $this.find('.j-validation').hide();
                            });
                        },
                        buttons: [
                            {
                                text: '提交',
                                click: function () {
                                    option.submit(this);
                                }
                            },
                            {
                                text: '取消',
                                click: function () {
                                    $(this).dialog('close');
                                }
                            }
                        ]
                    }
                });
            },

            /**
             * 通过报表id获取报表名称
             *
             * @param {string} id 报表id
             * @public
             * @return {string} 报表名称
             */
            getNameById: function (id) {
                var reportList = this.model.get('reportList');
                for (var i = 0, len = reportList.length; i < len; i++) {
                    if (id == reportList[i].id) {
                        return reportList[i].name;
                        break;
                    }
                }
            },

            /**
             * 展示报表发布信息
             *
             * @param {event} event 点击事件
             * @public
             */
            showPublishInfo: function (event) {
                var reportId = this.getLineId(event);

                this.reportView.publishReport('GET', reportId);
            },

            /**
             * 销毁当前view
             *
             * @public
             */
            destroy: function () {
                // 销毁 model
                this.model.clear({silent: true});
                // 停止监听model事件
                this.stopListening();
                // 解绑jq事件
                $(this.el).unbind().empty();
            }
        });
    }
);