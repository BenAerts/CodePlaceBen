sap.ui.jsview("workingwithodata.Main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf workingwithodata.Main
	*/ 
	getControllerName : function() {
		return "workingwithodata.Main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf workingwithodata.Main
	*/ 
	createContent : function(oController) 
	{		
		// *********************************************************************************************************************************
		// Building up the the UI - placing different Controls on the UI and instantiation.
		// *********************************************************************************************************************************
		// create a simple matrix layout - structuring controls on the screen
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			id : "matrix1",
			layoutFixed : false
			});
		
		var oDialog = new sap.ui.commons.Dialog();
		oDialog.setWidth("500px");
		oDialog.setHeight("400px");
		oDialog.setTitle("Returned results OData service call");
		oDialog.attachClosed(function() 
				{
					this.destroyContent();
					sap.ui.getCore().applyChanges();
				});
		
		var oLink = new sap.ui.commons.Link("l1", {
			text: "services.odata.org/V4/TripPinServiceRW/",
			href: "http://services.odata.org/V4/(S(g4m2uvqx0izgxxaonk1skxte))/TripPinServiceRW/",
			title: "TripPinServiceRW",
			target: "_blank"
		});
		
		var oLink2 = new sap.ui.commons.Link("l2", {
			text: "services.odata.org/V3/Northwind/Northwind.svc/",
			href: "http://services.odata.org/V3/Northwind/Northwind.svc/",
			title: "Northwind.svc",
			target: "_blank"
		});
		
		var oTextView = new sap.ui.commons.TextView();
		oTextView.setText
		(
				"This demo-project can be used in order to test how to invoke OData service calls and how to capture the results of the service " +
				"calls on the UI. " + 
				"A click on each of below buttons" + "\n" + "will invoke a different OData-service call corresponding to its description. "  + 
				"The results of the request will be logged to the console with the plain response of the invocation and the actual results" + "\n"  + 
				"Please use the debugger tools to check how the different requests work and to check the different responses." + "\n\n" +
				"During below examples the following public accessible OData services have been used as an example:"
				
		);
		
		var oButtonCallODatajsLib = new sap.ui.commons.Button({
			text : "OData (v4) service call - odatajs library",
			press : function() 
			{
				oController.requestPeopleDatajsLib(callback);
			}
		});
		
		var oButtonCallODataAJAX = new sap.ui.commons.Button({
			text : "OData (v4) service call - Ajax request",
			press : function() 
			{
				oController.requestPeopleAJAXCall(callback);
			}
		});
		
		var oButtonCallODataIndRec = new sap.ui.commons.Button({
			text : "OData (v4) service call - request an individual resource",
			press : function() 
			{
				oController.requestPeopleIndRec(callback, oDropdownBox1.getValue());
			}
		});
		
		var oDropdownBox1 = new sap.ui.commons.DropdownBox("DropdownBox1");
		oDropdownBox1.setEditable(true);
		oDropdownBox1.setWidth("200px");
		
		var oButtonCallODataQuery = new sap.ui.commons.Button({
			text : "OData (v4) service call - pass query string",
			press : function() 
			{
				oController.callWithQueryString(callback);
			}
		});
		
		var oButtonODataInvokeFn = new sap.ui.commons.Button({
			text : "OData (v4) service call - Invoke a function in OData call",
			press : function() 
			{
				oController.ODataCallInvokeFn(callback);
			}
		});
				
		var oTable = new sap.ui.table.Table("table", {
			title: "Example binding OData models to a table-control",
			visibleRowCount: 8,
			firstVisibleRow: 3,
			selectionMode: sap.ui.table.SelectionMode.Single,
			columns: 
			[
			 	new sap.ui.table.Column
			 	(
			 			{
			 				label: new sap.ui.commons.Label({text: "Product name"}),
			 				template: new sap.ui.commons.TextView().bindProperty("text", "ProductName")
			 			}
			 	),
			 	new sap.ui.table.Column
			 	(
			 			{
			 				label: new sap.ui.commons.Label({text: "Price/ unit"}),
			 				template: new sap.ui.commons.TextView().bindProperty("text", "UnitPrice")
			 			}
			 	),
			 	new sap.ui.table.Column
			 	(
			 			{
			 				label: new sap.ui.commons.Label({text: "Stock"}),
			 				template: new sap.ui.commons.TextView().bindProperty("text", "UnitsInStock")
			 			}
			 	),
			 	new sap.ui.table.Column
			 	(
			 			{
			 				label: new sap.ui.commons.Label({text: "Quantity/ unit"}),
			 				template: new sap.ui.commons.TextView().bindProperty("text", "QuantityPerUnit")
			 			}
			 	)
			]
		});
		
		oLayout.createRow(oTextView);
		oLayout.createRow(oLink);
		oLayout.createRow(oLink2);
		oLayout.createRow("");
		
		oLayout.createRow("OData service-call using the datajs library introduced by odata.org. depending on the version of odata you will have to use a different library");
		oLayout.createRow(oButtonCallODatajsLib);
		
		oLayout.createRow("OData service-call created by using AJAX technology");
		oLayout.createRow(oButtonCallODataAJAX);
		
		oLayout.createRow("OData service-call to one individual resource inside the people collection of the OData-service.");
		oLayout.createRow(oDropdownBox1);
		oLayout.createRow(oButtonCallODataIndRec);
		
		oLayout.createRow("OData service-call passing query string to the REST API to get specific resources in the return result");
		oLayout.createRow(oButtonCallODataQuery);
		
		oLayout.createRow("Invoking a function defined in the OData service");
		oLayout.createRow(oButtonODataInvokeFn);

		oLayout.createRow("");
		oLayout.createRow(oTable);
				
		return oLayout;
		 
		 // *********************************************************************************************************************************
		 // Handling the returned response of the OData services and display result on the UI
		 // *********************************************************************************************************************************
		 //Callback function dealing with Asynchronious requests.
		 function callback (asyncReqResults, infoMessage)
		 {
			 if (asyncReqResults != undefined)
		     {
				 console.log("**********************************");
				 console.log("Plain response from OData Request");
				 console.log("**********************************");
				 console.log(asyncReqResults);
				 
				 console.log("**********************************");
				 console.log("Results from OData request:");
				 console.log("**********************************");
				 var oText = new sap.ui.commons.TextView();
				 oText.setText("");
				 if (Object.prototype.toString.call(asyncReqResults) === "[object Array]")
		         {
					 oText.setText(infoMessage);
					 for (var i=0; i<=asyncReqResults.length - 1; i++)
				     {							 
						 console.log(asyncReqResults[i].FirstName + " " + asyncReqResults[i].LastName);	
						 var oExistingtext = oText.getText();
						 oText.setText(oExistingtext + "\n" + asyncReqResults[i].FirstName + " " + asyncReqResults[i].LastName);
						 pushToDialog(oText);
				     }
		         }else {
		        	 if (Object.prototype.toString.call(asyncReqResults) === "[object Object]")
		        	 {
		        		 if (asyncReqResults.hasOwnProperty("value"))
		        	     {
		        			 oText.setText(infoMessage);
							 for (var i=0; i<=asyncReqResults.value.length - 1; i++)
						     {				 
								 console.log(asyncReqResults.value[i].FirstName + " " + asyncReqResults.value[i].LastName)
								 var oExistingtext = oText.getText();
								 oText.setText(oExistingtext + "\n" + asyncReqResults.value[i].FirstName + " " + asyncReqResults.value[i].LastName);
								 pushToDialog(oText);
						     }
		        	     }else {
		        	    	 console.log("The person returned is: " + asyncReqResults.FirstName + " " + asyncReqResults.LastName + " \n" + 
				        	    	 "Gender: " + asyncReqResults.Gender);
							 
							 oText.setText(infoMessage + 
									 "Name: " + asyncReqResults.FirstName + " " + asyncReqResults.LastName + " \n" + 
				        	    	 "Gender: " + asyncReqResults.Gender + "\n" + "Primary email address: " + asyncReqResults.Emails[0]);
							 pushToDialog(oText);
		        	     }

		        	 }

		         }
		     }

			 
		 }
		 
		 function pushToDialog (oData)
		 {			 
				if(!oDialog.isOpen())
				{
					oDialog.addContent(oData);	
					oDialog.open();
				}
		 }
		 
		 
	}

});
