app.controller('tableCtrl', ['$rootScope','$scope', '$http',function($rootScope,$scope, $http) {
	
	$scope.isHide = true
	$(function () {

	    //1.初始化Table
	    var oTable = new TableInit();
	    oTable.Init();

	    //2.初始化Button的点击事件
	    var oButtonInit = new ButtonInit();
	    oButtonInit.Init();

	});
	
	var mydata = "";
	$http.get("js/data/parent.json").then(function (data) {
		mydata = data.data;
		console.log(mydata);
	});
	
	var TableInit = function () {
	    //var oTableInit = new Object();
	    //初始化Table
	    this.Init = function () {
	        $('#tb_departments').bootstrapTable({
	        	data:mydata,
	            /*url: 'js/data/parent.json',         //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
*/	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            striped: true,                      //是否显示行间隔色
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,                   //是否显示分页（*）
	            sortable: true,                     //是否启用排序
	            sortOrder: "asc",                   //排序方式
	            //queryParams: oTableInit.queryParams,//传递参数（*）
	            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
	            pageNumber:1,                       //初始化加载第一页，默认第一页
	            pageSize: 3,                       //每页的记录行数（*）
	            pageList: [3, 6, 10],        //可供选择的每页的行数（*）
	            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
	            strictSearch: true,
	            showColumns: true,                  //是否显示所有的列
	            showRefresh: true,                  //是否显示刷新按钮
	            minimumCountColumns: 2,             //最少允许的列数
	            clickToSelect: true,                //是否启用点击选中行
	            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
	            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
	            cardView: false,                    //是否显示详细视图
	            detailView: true,                   //是否显示父子表
	            columns: [{
	                checkbox: true
	            }, {
	                field: 'id',
	                title: 'id'
	            }, {
	                field: 'code',
	                title: 'code'
	            }, {
	                field: 'version',
	                title: 'version'
	            }, {
	                field: 'start_time',
	                title: 'start_time'
	            }, {
	                field: 'end_time',
	                title: 'end_time'
	            }, ],
	          //注册加载子表的事件。注意下这里的三个参数！
                onExpandRow: function (index, row, $detail) {
                    InitSubTable($scope,index, row, $detail);
                }
	        });
	    };

	}
	
	
	//初始化子表格(无线循环)
    InitSubTable = function ($scope,index, row, $detail) {
        var parentid = row.id;
        var cur_table = $detail.html('<table></table>').find('table');
        $(cur_table).bootstrapTable({
            url: 'js/data/child.json',
            method: 'get',
           /* queryParams: { strParentID: parentid },
            ajaxOptions: { strParentID: parentid },*/
            clickToSelect: true,
            detailView: false,//父子表
            uniqueId: "id",
            pageSize: 3,
            pageList: [3, 5],
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'id'
            }, {
                field: 'key',
                title: 'key'
            }, {
                field: 'value',
                title: 'value'
            }, {
                field: 'desc',
                title: 'desc'
            }, {
                field: 'operation',
                title: '操作',
                formatter:function(value,row,index){
                	var a = '<button type="button" class="btn btn-default"><a class = "add2" href="javascript:void(0)">新增</a></button>';
                    var s = '<button type="button" class="btn btn-default"><a class = "edit2" href="javascript:void(0)">编辑</a></button>';
                    var d = '<button type="button" class="btn btn-default"><a class = "remove" href="javascript:void(0)">删除</a></button>';
                    return a+' '+s+' '+d;
                },
                events: 'operateEvents'
            }],
            /*//无线循环取子表，直到子表里面没有记录
            onExpandRow: function (index, row, $Subdetail) {
                oInit.InitSubTable(index, row, $Subdetail);
            }*/
        });
    };
	
    $scope.reback = function(){
    	$scope.isHide = true;
    	$(function () {
    	    //1.初始化Table
    	    var oTable = new TableInit();
    	    oTable.Init();

    	});
    }
	
    $scope.add = function(){
    	$scope.isHide = false;
    }
    window.operateEvents = {
    		'click .add2': function (e, value, row, index) {
    			/*$('#div_1').hide()
    			$('#div_2').show()*/
    			$scope.id = "xx";
    			$scope.isHide = false;
    	    	alert("add2:"+$scope.isHide)
    	    	return
    	      /*  $.ajax({
    	            type: "post",
    	            data: row,
    	            url: '/Analyze/EditMeterMeasureHistoryData',
    	            success: function (data) {
    	                alert('修改成功');
    	            }
    	        });*/
    	    },
    	    'click .edit2': function (e, value, row, index) {
    	    	$scope.isHide = false;	
    	    	//alert("edit2:"+index)
    	      /*  $.ajax({
    	            type: "post",
    	            data: row,
    	            url: '/Analyze/EditMeterMeasureHistoryData',
    	            success: function (data) {
    	                alert('修改成功');
    	            }
    	        });*/
    	    },
    	    'click .remove': function (e, value, row, index) {
    	    	//alert("remove："+JSON.stringify(row));
    	    	//搞定	
    	       /* $.ajax({
    	            type: "post",
    	            data: row,
    	            url: '/Analyze/DeleteMeterMeasureHistoryData',
    	            success: function (data) {
    	                alert('删除成功');
    	                $('#querylist').bootstrapTable('remove', {
    	                    field: 'MeterMeasureHistoryID',
    	                    values: [row.MeterMeasureHistoryID]
    	                });
    	            }
    	        });*/
    	    }
    	};
	
	   /* //得到查询的参数
	    oTableInit.queryParams = function (params) {
	        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	            limit: params.limit,   //页面大小
	            offset: params.offset,  //页码
	            departmentname: $("#txt_search_departmentname").val(),
	            statu: $("#txt_search_statu").val()
	        };
	        return temp;
	    };
	    return oTableInit;
	};*/


	var ButtonInit = function () {
	    var oInit = new Object();
	    var postdata = {};

	    oInit.Init = function () {
	        //初始化页面上面的按钮事件
	    };

	    return oInit;
	};
}]);