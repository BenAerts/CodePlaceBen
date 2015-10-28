sap.ui.controller("workingwithodata.Main", {	
	// ********************************************************************************************************************************************************
	// below you can find different techniques in order to handle OData requests
	
	// requestPeopleAJAXCall: technique using AJAX technology to create an OData request.
	// the Cross-origin has been handled using the SAPUI5 proxy servlet.
	// using this technique values are being returned in form of an Array.
	
	// requestPeopleDatajsLib: technique using the datajs library to create the OData request.
	// the Cross-origin has been handled using the SAPUI5 proxy servlet.
	// using this technique the values are being returned in form of an object.
	
	// Asynchronious requests to the OData service have been handled by a Callback function
	
	// When working with the SAP HANA Cloud Platform the proxy servlet could be replaced by a destination in the HCP
	// in the WebIDE do not forget to add the created destination in the neo-app.json file.
	// ********************************************************************************************************************************************************
	
	// Calling OData service using AJAX call
	requestPeopleAJAXCall: function (callback)
	{		
		$.ajax({
		    url: this.getUrl("/V4/TripPinServiceRW/People"),
		    contentType: 'application/json; charset=utf-8',
		    type: 'GET',
		    dataType: 'json',
		    crossDomain: true,
		    error: function (xhr, status) {
		        alert(status);
		    },
		    success: function (result) {
		    	//Do Something with the CORS result - injecting the result in the callback to capture the result in the view after rendering
		    	callback(result, "Who are the other people registered in the Trip management system? \n");		        
		    }
		});
		
	},

// handling OData service using oDatajs library for V4 OData services.	
	requestPeopleDatajsLib: function (callback)
	{	
		var serviceRoot = this.getUrl("/V4/TripPinServiceRW/");
		var headers = { "Content-Type": "application/json", Accept: "application/json" };
		var request = {
		    requestUri: serviceRoot + "People",
		    method: "GET",
		    headers: headers,
		    data: null
		};
		odatajs.oData.request(
		    request,
		    function (data, response) {
		        var people = data.value;		        
		        // Invoke the callback again and inject the results to capture the result in the view after rendering
		        callback(people, "Who are the other people registered in the Trip management system? \n");  
		    },
		    function (err) {
		        alert('Fail: ' + err.Message);
		    }
		);
	},
	
	// Counting the number of records returned from collection People.
	countNumberPeople: function (callback)
	{	
		var serviceRoot = this.getUrl("/V4/TripPinServiceRW/");
		var headers = { "Content-Type": "application/json", Accept: "application/json" };
		var request = {
		    requestUri: serviceRoot + "People/$count",
		    method: "GET",
		    headers: headers,
		    data: null
		};
		odatajs.oData.request(
		    request,
		    function (data, response) {
		        var count = data.value;		        
		        // Invoke the callback again and inject the results to capture the result in the view after rendering
		        callback(count);
		    },
		    function (err) {
		        alert('Fail: ' + err.Message);
		    }
		);
	},
	
	callWithQueryString: function (callback)
	{	
		var serviceRoot = this.getUrl("/V4/TripPinServiceRW/");
		var headers = { "Content-Type": "application/json", Accept: "application/json" };
		var request = {
		    requestUri: serviceRoot + "People?$top=2 & $filter=Trips/any(d:d/Budget gt 3000)",
		    method: "GET",
		    headers: headers,
		    data: null
		};
		odatajs.oData.request(
		    request,
		    function (data, response) {
		        var people = data.value;		        
		        // Invoke the callback again and inject the results to capture the result in the view after rendering
		        callback(people, "The first 2 people who registered a trip for a budget for more than €3000: \n");
		    },
		    function (err) {
		        alert('Fail: ' + err.Message);
		    }
		);
	},
	
	ODataCallInvokeFn: function (callback)
	{	
		var serviceRoot = this.getUrl("/V4/TripPinServiceRW/");
		var headers = { "Content-Type": "application/json", Accept: "application/json" };
		var request = {
		    requestUri: serviceRoot + "People('russellwhyte')/Trips(0)/Microsoft.OData.SampleService.Models.TripPin.GetInvolvedPeople()",
		    method: "GET",
		    headers: headers,
		    data: null
		};
		odatajs.oData.request(
		    request,
		    function (data, response) {
		        var people = data.value;		        
		        // Invoke the callback again and inject the results to capture the result in the view after rendering
		        callback(people, "Who else is going to the same trip as Russel Whyte? \n");
		    },
		    function (err) {
		        alert('Fail: ' + err.Message);
		    }
		);
	},
	
	// Requesting an individual resource
	// http://services.odata.org/V4/TripPinServiceRW/People('russellwhyte')
	requestPeopleIndRec: function (callback, RequestedRecord)
	{	
		var serviceRoot = this.getUrl("/V4/TripPinServiceRW/");
		var headers = { "Content-Type": "application/json", Accept: "application/json" };
		var request = {
		    requestUri: serviceRoot + "People('" + RequestedRecord + "')",
		    method: "GET",
		    headers: headers,
		    data: null
		};
		odatajs.oData.request(
		    request,
		    function (data, response) {
		        var indResource = data;		        
		        // Invoke the callback again and inject the results to capture the result in the view after rendering
		        callback(indResource, "Viewing the info of one specific person registered in the Trip management system: \n");
		    },
		    function (err) {
		        alert('Fail: ' + err.Message);
		    }
		);
	},
	
	// Use proxy in case of direct connection to the server - avoiding Cross-origin call
	// The simple SAPUI5 proxy servlet has been used as proxy (web.xml)
	getUrl : function(sUrl) 
	{
		if (sUrl == "")
		{
			return sUrl;
		}			
		if (window.location.hostname == "localhost") 
		{
			return "proxy" + sUrl;
		} else {
			return sUrl;
		}
	},
	
	// Callback function supporting ansynchronious request while setting model data for oModel2 during init function
	callback: function (result)
	{
		var oModel2 = new sap.ui.model.json.JSONModel();
		oModel2.setData({modelData: result});
		var oDropDown = sap.ui.getCore().byId("DropdownBox1");
		oDropDown.setModel(oModel2);
		
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "UserName");

		oDropDown.bindItems("/modelData", oItemTemplate1);
	},
	
	onInit: function() 
	{
		// Instantiating the OData model
		var oModel = new sap.ui.model.odata.v2.ODataModel(this.getUrl("/V3/Northwind/Northwind.svc/"));
		
		var oTable = sap.ui.getCore().byId("table");		
		oTable.setModel(oModel);
		oTable.bindRows("/Products");
		
		this.requestPeopleDatajsLib(this.callback);
		sap.ui.getCore().applyChanges();
	}

});