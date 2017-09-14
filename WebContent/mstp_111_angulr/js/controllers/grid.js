app.controller('GridDemoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    
   /* $scope.monitorItem = {};
    $scope.monitorItem.inspectionNo = 1;
    $scope.pageSizes = [250, 500, 1000];
    $scope.pageSize = 250;
    $scope.currentPage = 1;*/
    
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [250, 500, 1000],
        pageSize: 250,
        currentPage: 1
    };  
    
   /* $scope.submitItem = [];//选择某行时的数据
    // 初始化弹出框信息
    var msgInfo;
    //表单字段对象
    $scope.item = {};
    //全选
    var selected = false;
    $scope.selectAll = function () {
        selected = !selected;
        angular.forEach($scope.datas, function (item) {
            item.selected = selected;
        });
    };
    
    // 操作时的弹出框
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: '../tpl/modal.html',
            controller: 'Notice',
            scope: $scope,
            size: 'sm',
            backdrop: 'static',
            resolve: {
                msg: function () {
                    return msgInfo;
                }
            }
        });
    };
    
    
     数据表格函数 
    $scope.query = function (pageSize, currentPage) {
        var find = angular.toJson({'pageSize': pageSize, 'pageNo': currentPage});
        httpJesen.formPost('barCodeRule/queryBarCodeRuleList', find, function (data) {
            var message = data.responseMsg;
            if (data.responseCode == 1) {
                console.log(data);
                $scope.datas = data.responseData.BarCodeRuleList;
                $scope.totalItems = data.responseData.page.totalCount;
                console.log($scope.datas);
                console.log($scope.totalItems);
                $scope.numPages = Math.ceil($scope.totalItems / pageSize);
            } else {
                msgInfo = {title: "提示", msg: message, pbtn: "确认", pshow: true, nbtn: "取消", nshow: true};
                $scope.open();
            }
        });
    };
    //根据分页查询数据
    $scope.query($scope.pageSize, $scope.currentPage);
    
  //新增二维码规则
    $scope.addQcode = function () {
        var modalInstance = $modal.open({
            templateUrl: 'addOcode.html',
            controller: "addQcodeController",
            size: 'lg',
            scope: $scope,
            backdrop: 'static',
            resolve: {
                items: function () {
                    $scope.items = {
                        type: "add"
                    };
                    return $scope.items;
                }

            }
        });
    };
    //删除
    $scope.delQrcode = function (thisdata) {
        $scope.detailId = thisdata.data.ruleId;
        console.log($scope.detailId);
        $rootScope.modalFun("确认要删除吗?", 'Notice', "sm", function () {
            httpJesen.singlePost('barCodeRule/delete', 'detailId=' + $scope.detailId, function (data) {
                var message = data.responseMsg;
                if (data.responseCode == 1) {
                    console.log(data.responseData);
                    msgInfo = {title: "提示", msg: "删除成功", pbtn: "确认", pshow: true, nbtn: "取消", nshow: true};
                    $scope.open();
                } else {
                    msgInfo = {title: "提示", msg: message, pbtn: "确认", pshow: true, nbtn: "取消", nshow: true};
                    $scope.open();
                }
                $scope.query($scope.pageSize, $scope.currentPage);
            });
        })
    };
    //编辑
    $scope.editQcode = function (thisdata) {
        $scope.detailId = thisdata.data.ruleId;
        console.log($scope.detailId);
        var modalInstance = $modal.open({
            templateUrl: 'addOcode.html',
            controller: "addQcodeController",
            size: 'lg',
            scope: $scope,
            backdrop: 'static',
            resolve: {
                items: function () {
                    $scope.items = {
                        type: "edit",
                        detailId: $scope.detailId
                    };
                    return $scope.items;
                }
            }
        });
    };
}]);
//增加组织弹框控制层
app.controller('addQcodeController', ['$rootScope', '$scope', '$modal', '$http', 'httpJesen', '$modalInstance', 'items', function ($rootScope, $scope, $modal, $http, httpJesen, $modalInstance, items) {
    console.log(items);
    $scope.items = items;
    console.log($scope.items);
    var msgInfo;
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: '../tpl/modal.html',
            controller: 'Notice',
            size: 'sm',
            backdrop: 'static',
            resolve: {
                msg: function () {
                    return msgInfo;
                }
            }
        });
    };
    */
    
    
    
    
    
    
    
    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('js/controllers/largeLoad.json').success(function (largeLoad) {    
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('js/controllers/largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        showGroupPanel: true,
        checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
        //selectedItems: $scope.submitItem,//选择某行这一行的对象就赋值给$scope.selectedItem
        showSelectionCheckbox: true	
        //i18n:'zh-cn'
        	
    };
}]);