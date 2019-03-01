/*
Knowage, Open Source Business Intelligence suite
Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.

Knowage is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

Knowage is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
	angular
		.module('cockpitModule')
		.directive('cockpitAdvancedTableWidget',function(){
			return{
				templateUrl: baseScriptPath+ '/directives/cockpit-widget/widget/advancedTableWidget/templates/advancedTableWidgetTemplate.html',
				controller: cockpitAdvancedTableWidgetControllerFunction,
				compile: function (tElement, tAttrs, transclude) {
					return {
						pre: function preLink(scope, element, attrs, ctrl, transclud) {
							
						},
						post: function postLink(scope, element, attrs, ctrl, transclud) {
							element.ready(function () {
	                    		scope.initWidget();
	                        });
						}
					};
				}
			}
		})
	function cockpitAdvancedTableWidgetControllerFunction(
			$scope,
			$mdDialog,
			$mdToast,
			$timeout,
			$mdPanel,
			$q,
			$sce,
			$filter,
			sbiModule_translate,
			sbiModule_restServices,
			cockpitModule_datasetServices,
			cockpitModule_widgetConfigurator,
			cockpitModule_widgetServices,
			cockpitModule_widgetSelection,
			cockpitModule_analyticalDrivers,
			cockpitModule_properties){
		
		$scope.showGrid = true;
		if(!$scope.ngModel.settings){
			$scope.ngModel.settings = {
				"pagination" : {
					'enabled': true,
					'itemsNumber': 10,
					'frontEnd': false
				},
				"page":1
			};
		}else $scope.ngModel.settings.page = 1;
		
		if(!$scope.ngModel.style) $scope.ngModel.style = {"th":{},"tr":{}}; 
		
		function getColumns(fields) {
			var columns = [];
			for(var c in $scope.ngModel.content.columnSelectedOfDataset){
				for(var f in fields){
					if(typeof fields[f] == 'object' && $scope.ngModel.content.columnSelectedOfDataset[c].name === fields[f].header){
						var tempCol = {"headerName":$scope.ngModel.content.columnSelectedOfDataset[c].alias,"field":fields[f].name};
						if(!$scope.ngModel.content.columnSelectedOfDataset[c].hideTooltip) tempCol.tooltipField = fields[f].name;
						if($scope.ngModel.content.columnSelectedOfDataset[c].style) tempCol.style = $scope.ngModel.content.columnSelectedOfDataset[c].style;
						if($scope.ngModel.content.columnSelectedOfDataset[c].style && $scope.ngModel.content.columnSelectedOfDataset[c].style.hiddenColumn) tempCol.hide = true;
						tempCol.headerComponentParams = {template: headerTemplate()};
						tempCol.cellStyle = getCellStyle;
						columns.push(tempCol);
						break;
					}
				}
			}
			return columns
		}
		
		function headerTemplate() { 
			return 	'<div class="ag-cell-label-container" role="presentation" style="background-color:'+$scope.ngModel.style.th["background-color"]+'">'+
					'	 <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>'+
					'    <div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="justify-content:'+$scope.ngModel.style.th["justify-content"]+'">'+
					'       <span ref="eText" class="ag-header-cell-text" role="columnheader" style="color:'+$scope.ngModel.style.th.color+';font-style:'+$scope.ngModel.style.th["font-style"]+';font-size:'+$scope.ngModel.style.th["font-size"]+';font-weight:'+$scope.ngModel.style.th["font-weight"]+'"></span>'+
					'       <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>'+
					'       <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>'+
					'    	<span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>'+
					'   	<span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>'+
					'  		<span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>'+
					'	</div>'+
					'</div>';
		}
		
		function getCellStyle(params){
			var tempStyle = angular.copy(params.colDef.style);
			return tempStyle;
		}
		
		$scope.init=function(element,width,height){
			$scope.refreshWidget(null, 'init');
			$timeout(function(){
				$scope.widgetIsInit=true;
			},500);

		}
		
		$scope.reinit = function(){
			$scope.refreshWidget();
		}
		
		$scope.refresh = function(element,width,height, datasetRecords,nature) {
			$scope.showWidgetSpinner();
			
			if(datasetRecords){
				$scope.totalRows = datasetRecords.results;
				$scope.advancedTableGrid.api.setColumnDefs(getColumns(datasetRecords.metaData.fields));
				$scope.advancedTableGrid.api.setRowData(datasetRecords.rows);
				if($scope.ngModel.settings.pagination && $scope.ngModel.settings.pagination.enabled && !$scope.ngModel.settings.pagination.frontEnd){
					$scope.ngModel.settings.pagination.itemsNumber = $scope.advancedTableGrid.api.getLastDisplayedRow()+1;
					$scope.totalPages = Math.ceil($scope.totalRows/$scope.ngModel.settings.pagination.itemsNumber) || 0;
				}
				if(!$scope.ngModel.settings.pagination.enabled) $scope.advancedTableGrid.api.paginationSetPageSize($scope.totalRows);
				if($scope.ngModel.settings.pagination.enabled && $scope.ngModel.settings.pagination.frontEnd && $scope.ngModel.settings.pagination.itemsNumber) $scope.advancedTableGrid.api.paginationSetPageSize($scope.ngModel.settings.pagination.itemsNumber);
				resizeColumns();
				$scope.hideWidgetSpinner();
			}
		}
		
		$scope.getOptions = function(){
			var obj = {};
				obj["page"] = $scope.ngModel.settings.page ? $scope.ngModel.settings.page - 1 : 0;
				obj["itemPerPage"] = ($scope.ngModel.settings.pagination && $scope.ngModel.settings.pagination.enabled && !$scope.ngModel.settings.pagination.frontEnd) ? $scope.ngModel.settings.pagination.itemsNumber : -1;
				obj["type"] = 'table';
			return obj;
		}
		
		$scope.advancedTableGrid = {
				angularCompileRows: true,
				onGridSizeChanged: resizeColumns,
				enableSorting: true,
				pagination : true,
				onCellClicked: onCellClicked
		}
		
		
		function resizeColumns(){
			$scope.advancedTableGrid.api.sizeColumnsToFit();
		}
	  	
	  	$scope.maxPageNumber = function(){
			if($scope.ngModel.settings.page*$scope.ngModel.settings.pagination.itemsNumber < $scope.totalRows) return $scope.ngModel.settings.page*$scope.ngModel.settings.pagination.itemsNumber;
			else return $scope.totalRows;
	  	}
	  	
	  	$scope.disableFirst = function(){
	  		return $scope.ngModel.settings.page == 1;
	  	}
	  	
	  	$scope.disableLast = function(){
	  		return $scope.ngModel.settings.page == $scope.totalPages;
	  	}
	  	
	  	$scope.first = function(){
	  		$scope.ngModel.settings.page = 1;
	  		$scope.refreshWidget();
		}
		
	  	$scope.prev = function(){
	  		if($scope.ngModel.settings.page == 1) return;
	  		$scope.ngModel.settings.page = $scope.ngModel.settings.page - 1;
	  		$scope.refreshWidget();
		}
		
	  	$scope.next = function(){
	  		$scope.ngModel.settings.page = $scope.ngModel.settings.page + 1;
	  		$scope.refreshWidget();
		}
		
	  	$scope.last = function(){
	  		$scope.ngModel.settings.page = $scope.totalPages;
	  		$scope.refreshWidget();
		}
		
		
		function onCellClicked(node){
			$scope.doSelection(node.column.colDef.headerName, node.value, $scope.ngModel.settings.modalSelectionColumn, null, node.data);
		}
		
		$scope.$watchCollection('ngModel.settings.pagination',function(newValue,oldValue){
			if(newValue != oldValue){
				$scope.showGrid = false;
				if(newValue && newValue.enabled && newValue.frontEnd){
					if(!newValue.itemsNumber) $scope.advancedTableGrid.paginationAutoPageSize = true;
					else $scope.advancedTableGrid.paginationAutoPageSize = false;
				}else if(newValue && !newValue.enabled){
					$scope.advancedTableGrid.paginationAutoPageSize = false;
					$scope.advancedTableGrid.paginationPageSize = $scope.totalRows;
				}else $scope.advancedTableGrid.paginationAutoPageSize = false;
				$scope.showGrid = true;
				if(newValue && newValue.enabled != oldValue.enabled) $scope.refreshWidget();
			}
		})

		$scope.editWidget=function(index){
			var finishEdit=$q.defer();
			var config = {
					attachTo:  angular.element(document.body),
					controller: advancedTableWidgetEditControllerFunction,
					disableParentScroll: true,
					templateUrl: baseScriptPath+ '/directives/cockpit-widget/widget/advancedTableWidget/templates/advancedTableWidgetEditPropertyTemplate.html',
					position: $mdPanel.newPanelPosition().absolute().center(),
					fullscreen :true,
					hasBackdrop: true,
					clickOutsideToClose: false,
					escapeToClose: false,
					focusOnOpen: true,
					preserveScope: false,
					locals: {finishEdit:finishEdit,model:$scope.ngModel},
			};
			$mdPanel.open(config);
			return finishEdit.promise;
		}

	}

	/**
	 * register the widget in the cockpitModule_widgetConfigurator factory
	 */
	addWidgetFunctionality("advanced-table",{'initialDimension':{'width':5, 'height':5},'updateble':true,'cliccable':true});

})();