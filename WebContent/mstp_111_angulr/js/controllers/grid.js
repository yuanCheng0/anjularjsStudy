app.controller('GridDemoCtrl', ['$scope', '$http','ngDialog','i18nService','$interval','$q', function($scope, $http,ngDialog,i18nService,$interval,$q) {
	i18nService.setCurrentLang('zh-cn');
	$scope.tabData = "";
	$scope.editMsg = {};
	var selectDb = "";
	var selectTab = "";
	var delData = [];
	var clickState = true; //用于全选时是选中还是取消状态
	/**
	 * 选择表，向后台请求数据
	 */
	 $scope.tab = {};
	 $scope.db_tabs = [
	     { dbName: 'db',    tabName: 'user'},
	     { dbName: 'dm', tabName: 'order'},
	     { dbName: 'dw',    tabName: 'test'},
	     { dbName: 'ods',  tabName: 'user'}
	     ];  
	 $scope.change = function(){
    	 selectDb = $scope.tab.selected.dbName;
    	 selectTab = $scope.tab.selected.tabName
    	 /*
    	 $http({
             method  : 'GET',
             url     : '/xxx/xxx',
             params  : {'dbName':selectDb,'tabName':selectTab},  // pass in data as strings
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
         })
           .success(function(data) {
             columns = Object.keys(data[0]);
        	 getPage(1, $scope.gridOptions.paginationPageSize,data);
         }).error(function(data){
         	//响应失败（响应以错误状态返回）操作
         });*/
	 }    
	$scope.gridOptions = {
	        data: 'myData',
	      //基础属性  
            enableSorting : true,//是否支持排序(列)  
            useExternalSorting : false,//是否支持自定义的排序规则  
            enableRowHeaderSelection : true,  
            enableGridMenu : true	,//是否显示表格 菜单  
            showGridFooter: true,//时候显示表格的footer  
            enableHorizontalScrollbar : 1,//表格的水平滚动条  
            enableVerticalScrollbar : 1,//表格的垂直滚动条 (两个都是 1-显示,0-不显示)  
            selectionRowHeaderWidth : 30,  
            enableCellEditOnFocus:false,//default为false,true的时候单击即可打开编辑(cellEdit为true的时候,需要引入'ui.grid.cellNav')  
            //分页属性  
            enablePagination: true, //是否分页，默认为true
            enablePaginationControls: true, //使用默认的底部分页
            paginationPageSizes: [5, 15, 20], //每页显示个数可选项
            paginationCurrentPage:1, //当前页码
            paginationPageSize: 5, //每页显示个数
            //paginationTemplate:"<div></div>", //自定义底部分页代码
            totalItems : 0, // 总数量
            useExternalPagination: true,//是否使用分页按钮
            //rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
            
            //----------- 选中 ----------------------
            enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection : false, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
            enableRowSelection : true, // 行选择是否可用，默认为true;
            enableSelectAll : true, // 选择所有checkbox是否可用，默认为true; 
            enableSelectionBatchEvent : true, //默认true
           /* isRowSelectable: function(row){ //GridRow
               if(row.entity.age > 45){
                   row.grid.api.selection.selectRow(row.entity); // 选中行
               }
            },*/
            modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
            multiSelect: true ,// 是否可以选择多个,默认为true;
            noUnselect: false,//默认false,选中后是否可以取消选中
            selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；
            
            rowEditWaitInterval:3000, //编辑等待时长,过时自动保存
            //---------------api---------------------
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                //编辑离开事件 待删除/无用
                /*$scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity){ 
                	//alert("是否保存？")
                	console.log(rowEntity.id+"---"+rowEntity.name+"---"+rowEntity.sex);
                     // alert(rowEntity)
                });  */
                
                //3s后自动提交保存
                $scope.gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
                //分页按钮事件
                gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                      if(getPage) { 
                          getPage(newPage, pageSize,$scope.tabData); 
                       }
                });
                //行选中事件
                //set gridApi on scope
                var arrs =[];
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                	arrs.splice(0,1)
                	console.log(arrs+"--"+ arrs.length)
                  
                  var msg = 'row selected ' + row.isSelected;
                  if(row.isSelected){
                	  delData.push(row.entity)
                	  console.log("单条添加后"+delData.length);
                	 // console.log("添加后："+str)
                  }else{
                	  for(var i = 0;i <= delData.length;i++){
                		  if(delData[i]==row.entity){
                			  delData.splice(i,1);
                			  console.log("单条删除后"+delData.length);
                			  console.log("单条删除后"+delData.length);
                		  }
                	  }
                  }
                  //console.log(msg);
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
                	console.log("批量添加前"+delData.length);
                  if(clickState){
	                  for(var i = 0;i < rows.length;i++){
	                	  delData.push(rows[i].entity);
	                  }	
	                  clickState = false;
	                  //无用
	                 /* var tempDelData = [],hash = {};
	                  for(var i = 0,elem;(elem = delData[i]) != null; i++){
	                	  if(!hash[elem]){
	                		  tempDelData.push(elem);
	                		  hash[elem] = true;
	                	  }
	                  }
	                  delData = tempDelData;
	                  console.log(tempDelData.length);
	                  clickState = false;
                  }else{*/
	                  console.log("批量添加后"+delData.length);
                  }else{
                	 /* for(var i = 0;i < delData.length;i++){
                		  if(delData[i]==row.entity){
                			  delData.splice(i,1);
                			  //console.log("删除后："+delData[i]+"，长度"+ delData.length);
                		  }
                	  }*/
                	  delData.splice(0,delData.length);
                	  console.log("批量删除后"+delData.length);
                	  clickState = true;
                  }
                });
            } 	
	    };
		
		/**
		 * 删除数据
		 */
		$scope.del = function(){
			if(confirm("您确认要删除所选点数据？")){
				//向后台提交要删除点数据
				$http({
					method  : 'POST',
					url     : '/xxx/xxx',
					data    : delData,  // pass in data as strings
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
				})
				.success(function(data) {
					//true
					msg = data;
				}).error(function(data){
					//响应失败（响应以错误状态返回）操作
					//false
					msg = data;
				});
			}else{
					
					alert("不，我不删除了"+delData[0].id+"--"+delData[1].id)
			}
			
		}
		
	 	$scope.saveRow = function( rowEntity ) {
		    // create a fake promise - normally you'd use the promise returned by $http or $resource
	 		rowEntity.dbName = selectDb;
	 		rowEntity.tabName = selectTab;
	 		console.log(rowEntity);
		    var promise = $q.defer();
		    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
		    
		    var msg;
		    //向后台请求保存修改的数据
		    /*$http({
	             method  : 'POST',
	             url     : '/xxx/xxx',
	             data    : rowEntity,  // pass in data as strings
	             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	         })
	           .success(function(data) {
	           //true
	            msg = data;
	         }).error(function(data){
	         	//响应失败（响应以错误状态返回）操作
	         	//false
	         	msg = data;
	         });*/
		    
		    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
		    $interval( function() {
		      if (msg){
		        promise.reject();
		        alert("保存失败")
		      } else {
		        promise.resolve();
		        alert("保存成功")
		      }
		    }, 1000, 1);
		  };
	
	
		var columns = "";
		var getPage = function(curPage, pageSize,mydefalutData) {
			
	        var firstRow = (curPage - 1) * pageSize;
	        $scope.gridOptions.totalItems = mydefalutData.length;
	        $scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
	};
	
	/**
	 * 前端全表过滤查询
	 */
	$scope.filterOptions = {
	        filterText: "",
	        useExternalFilter: true
	    }; 

	$scope.$watch('filterOptions', function (newVal, oldVal) {
		    var filterData;
	        if (newVal !== oldVal) {
	          //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        	var ft = $scope.filterOptions.filterText.toLowerCase();
                filterData = $scope.tabData.filter(function(item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                })
                //$scope.setPagingData(data,page,pageSize);
                getPage($scope.gridOptions.paginationCurrentPage, $scope.gridOptions.paginationPageSize,filterData);
                //getPage($scope.gridOptions.paginationCurrentPage, $scope.gridOptions.paginationPageSize,$scope.tabData);
	        }
	    }, true);
		
	
	/**
	 * 测试数据
	 */
	 $http.get('js/controllers/largeLoad.json').success(function (largeLoad) {
		 $scope.tabData = largeLoad;
		 columns = Object.keys(largeLoad[0]);
		 getPage(1, $scope.gridOptions.paginationPageSize,largeLoad);
	});
	 
	
	
    
	 /**
	     * 新增数据
	     */
	    $scope.columns = "";
	    
	    $scope.add = function(){
	    	$scope.columns = columns;
	    	ngDialog.open({
	    		showClose:true,
	    		closeByDocument:false,
	    		template:'tpl/newAdd.html',
	    		className:'ngDialog-theme-default',
	    		scope:$scope
	    	});
	    };
	    
	    
	    $scope.user = "";
    	var formData = [];
    	var str = "";
    	 $scope.saveUser = function() {
    		 //val id = $("input").attr("id");
			 //var c=document.getElementById(id);
    		 //alert(columns)
    		 var tmp ="";
			 for(var i=0;i<columns.length;i++){
				// alert(columns[i])
				var value = document.getElementById(columns[i]).value;
				str = "\"" + columns[i] + "\"" + ":" + "\"" +value + "\"" +"," + str;
			 }
			 
			var jsonStr = "{"+ str.substring(0,str.length - 1) + "}";
			//var jsonObj = JSON.stringify(jsonStr);
			$scope.jsonObj = JSON.stringify(jsonStr);
	        //alert($scope.jsonObj)
			 
	         $http({
	             method  : 'POST',
	             url     : '/xxx/xxx',
	             data    : $scope.jsonObj,  // pass in data as strings
	             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	         })
	             .success(function(data) {
	                 console.log(data);
	                 if (!data.success) {
	                 } else {
	                	 alert("保存失败");
	                 }
	             });
         };
	 
	 
	 
	 
	 
}]);