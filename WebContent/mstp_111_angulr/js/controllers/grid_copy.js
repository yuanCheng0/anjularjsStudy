app.controller('GridDemoCtrl', ['$scope', '$http','ngDialog', function($scope, $http,ngDialog) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [2, 4, 6],
        pageSize: 2,
        currentPage: 1
    };  
    
    $scope.largeLoad = "";
    
    /**
     * 选择表
     */
     /*$scope.tab = {};
     $scope.db_tabs = [
         { dbName: 'db',    tabName: 'user'},
         { dbName: 'dm', tabName: 'order'},
         { dbName: 'dw',    tabName: 'test'},
         { dbName: 'ods',  tabName: 'user'}
         ];   
     
     $scope.change = function(){
    	 var selectDb = $scope.tab.selected.dbName;
    	 var selectTab = $scope.tab.selected.tabName
    	 
    	 $http({
             method  : 'GET',
             url     : '/xxx/xxx',
             params  : {'dbName':selectDb,'tabName':selectTab},  // pass in data as strings
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
         })
           .success(function(data) {
        	 $scope.largeLoad = data;  
        	 $scope.setPagingData(data,$scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
         }).error(function(data){
         	//响应失败（响应以错误状态返回）操作
         	});
    }*/
    
    
    
    var columns = "";
    $scope.setPagingData = function(data, page, pageSize){
    	columns = Object.keys(data[0]);
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
    
    /*$scope.getPagedDataAsync = function (pageSize, page, searchText,largeLoad) {
        setTimeout(function () {
            var data;
            if (searchText) {
            	alert("???")
                var ft = searchText.toLowerCase();
                data = largeLoad.filter(function(item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
                $scope.setPagingData(data,page,pageSize);
            }else{
                $scope.setPagingData(largeLoad,page,pageSize);
            }
        }, 100);
    };*/
    
    
    

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.largeLoad);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.largeLoad);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        //enableCellEdit:true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        showGroupPanel: true,
        checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
        //selectedItems: $scope.submitItem,//选择某行这一行的对象就赋值给$scope.selectedItem
        showSelectionCheckbox: true,
        //columnDefs:[{field: 'edit', displayName: '操作'}]
        //i18n:'zh-cn'
        	
    };
    
    
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
	        alert($scope.jsonObj)
			 
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
         
        /* $scope.edit11 = function(){
        	 alert("???")
         }*/
         
         
    
}]);