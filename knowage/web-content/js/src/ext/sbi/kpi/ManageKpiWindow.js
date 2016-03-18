/*
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.
 * 
 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */ 
 
  
 
  

/**
 * Object name
 * 
 * [description]
 * 
 * 
 * Public Properties
 * 
 * [list]
 * 
 * 
 * Public Methods
 * 
 * [list]
 * 
 * 
 * Public Events
 * 
 * [list]
 * 
 * Authors - Monica Franceschini
 */
Ext.ns("Sbi.kpi");

Sbi.kpi.ManageKpiWindow = function(config) { 
	var kpiParentId = config.kpiParentId;
	
	var paramsList = {LIGHT_NAVIGATOR_DISABLED: 'TRUE',MESSAGE_DET: "KPIS_LIST", id: kpiParentId};
	this.services = new Array();
	
	this.services['manageKpiService'] = Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'MANAGE_KPIS_ACTION'
		, baseParams: paramsList
	});

	
	this.store = new Ext.data.JsonStore({
    	autoLoad: false    	  
    	, id : 'id'		
        , fields: ['id'
      	          , 'name'
    	          , 'code'
    	          , 'description' 
    	          , ''
    	          ]
    	, root: 'rows'
		, url: this.services['manageKpiService']		
	});
	
	this.initWindow();
	
	var c = Ext.apply( {}, config, this.grid);
    // constructor
    Sbi.kpi.ManageKpiWindow.superclass.constructor.call(this, c);
	
    this.store.load();
    
    this.addEvents('selectEvent');
    this.addEvents('selected');

};

Ext.extend(Sbi.kpi.ManageKpiWindow, Ext.grid.GridPanel, {
  
  	reader:null
  	,currentRowRecordEdited:null
  	,services:null
  	,writer:null
  	,store:null
  	,userColumns:null
  	
  	, initWindow: function(){
	
	   	var pagingBar = new Ext.PagingToolbar({
	        pageSize: 16,
	        store: this.store,
	        displayInfo: true,
	        displayMsg: '', 
	        scope: this,
	        emptyMsg: "No topics to display"	        
	    }); 

	   	
		var selectColumn = new Ext.grid.ButtonColumn({
		       header:  ' '
		       ,iconCls: 'icon-select'
		       ,scope: this
		       ,clickHandler: function(e, t) {
		          var index = this.grid.getView().findRowIndex(t);	          
		          var selectedRecord = this.grid.store.getAt(index);
		          var itemId = selectedRecord.get('id');
		          this.grid.fireEvent('select', itemId, index);
		       }
		       ,width: 25
		       ,renderer : function(v, p, record){
		           return '<center><img class="x-mybutton-'+this.id+' grid-button ' +this.iconCls+'" width="16px" height="16px" src="'+Ext.BLANK_IMAGE_URL+'"/></center>';
		       }
	    });
		// Let's pretend we rendered our grid-columns with meta-data from our ORM framework.
		this.userColumns =  [
		    {
		        name: 'id',
		        hidden: true
		    },
	        {header: LN('sbi.generic.name'), width: 125, sortable: true, locked:false, dataIndex: 'name'},
	        {header: LN('sbi.generic.code'), width: 125, sortable: true, dataIndex: 'code'},
	        {header: LN('sbi.generic.descr'), width: 110, sortable: true, dataIndex: 'description'},
	        selectColumn
		];
		
	   	var filteringToolbar = new Sbi.widgets.FilteringToolbarLight( {
	   		store: this.store,
	   		columnName: LN('sbi.generic.name'),
	   		columnValue: this.userColumns[1].dataIndex
	   	});
	   	
		 var cm = new Ext.grid.ColumnModel({
		        // specify any defaults for each column
		        defaults: {
		            sortable: true // columns are not sortable by default           
		        },
		        columns: this.userColumns
		    });
		 
			 var sm = new Ext.grid.RowSelectionModel({
		         singleSelect: true
		     });
	
			 
		    // create the editor grid
		    this.grid = {
		    	xtype: 'grid',
		        store: this.store,
		        layout: 'fit',
		        cm: cm,
		        sm: sm,
		        plugins: [selectColumn],
		        width: 450,
		        height: 350,
		        bbar: pagingBar,
		        tbar: filteringToolbar,
		        frame: true,
		        listeners: {
			    	'select': {
			     		fn: this.sendSelectedItem,
			      		scope: this
			    	} ,
	      			viewready: function(g) {g.getSelectionModel().selectRow(0); } 
	             }
		       };
	}
	
	,sendSelectedItem: function(itemId, index){
		var selectedRecord = this.grid.store.getAt(index);
		this.fireEvent('selected',selectedRecord);
	}	

    
});

