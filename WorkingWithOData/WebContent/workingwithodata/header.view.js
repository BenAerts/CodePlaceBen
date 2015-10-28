sap.ui.jsview("workingwithodata.header", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf workingwithodata.header
	*/ 
	getControllerName : function() {
		return "workingwithodata.header";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf workingwithodata.header
	*/ 
	createContent : function(oController) {
		var oAppHeader = new sap.ui.commons.ApplicationHeader("appHeader"); 

		//configure the branding area - header
		oAppHeader.setLogoSrc("http://www.sap.com/global/images/SAPLogo.gif");
		oAppHeader.setLogoText("Demo-project OData service calls");
		
		return oAppHeader;
	}

});
