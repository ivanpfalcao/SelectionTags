var fieldsTranslations = [{
    Label: "",
    Field: ""
}];

var globalSelectedFields; // Global selected fields
var app; // Global app

// Set the colors to be selected
var palette = [
	"#b0afae",
	"#7b7a78",
	"#545352",
	"#4477aa",
	"#7db8da",
	"#b6d7ea",
	"#46c646",
	"#f93f17",
	"#ffcf02",
	"#276e27",
	"#ffffff",
	"#000000"
];

define( ["qlik","jquery", "text!./src/SelectionTags.css", "text!./template.html"], function (qlik, $, cssContent, template ) {'use strict';
    $("<style>").html(cssContent).appendTo("head");
	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				settings : {
					uses : "settings"									
				},
				MyList: {                              
					type: "array",                       
					ref: "layoutList",                     
					label: "Line Settings",    
					itemTitleRef: "label",               
					allowAdd: true,                      
					allowRemove: true,                   
					addTranslation: "Add Item",    					
					items: {                                                             
						label: {                           
							type: "string",                  
							//ref: "fieldName",                    
							ref: "label",                    
							label: "Field Name",                  
							expression: "always",          
							defaultValue: "Field Name"            
						}, 
						/*		
						DropDownDecSep: {
							type: "string",
							component: "dropdown",
							label: "Decimal Separator",
							ref: "DecSep",
							options: [{
								value: "DotSep",
								label: "Dot as Decimal Separator"
							}, 
							{
								value: "CommaSep",
								label: "Comma as Decimal Separator"
							}],
							defaultValue: "CommaSep"
						},	
						*/
						backgroundColor: {
							label:"Background Color",
							component: "color-picker",
							ref: "backgroundColor",
							type: "integer",
							defaultValue: 1
						},
						fontColor: {
							label:"Font Color",
							component: "color-picker",
							ref: "fontColor",
							type: "integer",
							defaultValue: 10
						}
					}                                    
				} 
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint: function ($element, layout) {
			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}

			
			//Generate View
			app = qlik.currApp(this);
			var selectionState = app.selectionState;
			
            var selections = app.getList("CurrentSelections", function(reply) {
				globalSelectedFields = reply.qSelectionObject.qSelections;
				var globalSelectedFieldsLength = globalSelectedFields.length,html = "";
				html+='<div class="qstag-container">';
				
				/*
				var tagDefaultBackgroundColor='#c2d6d6';
				var tagDefaultFontColor='#000000';
				var tagDefaultFontFamily='Arial';				
				var tagBackgroundColor='#c2d6d6';
				var tagFontColor='#000000';				
				var tagFontFamily='"Comic Sans MS", "Comic Sans", cursive';
				*/
				
				//Get the number of items 
				var lenItems = layout.layoutList.length;

				var dictBgColor = new Array();
				var dictFontColor = new Array();
				for (var i=0; i<lenItems;i++){
					var fieldName = layout.layoutList[i].label;
					var backgroundColor = layout.layoutList[i].backgroundColor;
					var fontColor = layout.layoutList[i].fontColor;
					dictBgColor[fieldName] = backgroundColor;
					dictFontColor[fieldName] = fontColor;
				}
				
				
				for (var i = 0; i < globalSelectedFieldsLength; i++) {
						
						var selectedValues = globalSelectedFields[i].qSelected;
						var splittedSelectedValues = selectedValues.split(", ");
						
						if (typeof dictBgColor[globalSelectedFields[i].qField] != 'undefined') {
							var tagBackgroundColor=palette[dictBgColor[globalSelectedFields[i].qField]];
							var tagFontColor=palette[dictFontColor[globalSelectedFields[i].qField]];
							var tagFontFamily='Arial';
						} else {
							var tagBackgroundColor='#c2d6d6';
							var tagFontColor='#000000';
							var tagFontFamily='Arial';
							
						}
						
						
						for (var j = 0; j < splittedSelectedValues.length; j++) {
							var tagValue = globalSelectedFields[i].qField + ' : ' + splittedSelectedValues[j];
							var tagIP = globalSelectedFields[i].qField + '||-||' + splittedSelectedValues[j]+ '||-||' + i + '||-||' + j;
							html+='<ul class="qstag-taglist">';
                     		html+='<li style="background-color:'+ tagBackgroundColor +';color:' + tagFontColor + ';opacity: 1;" data-tag="tag" class="qstag-tag"><div class="qstag-tag-content"><span class="qstag-tag-text"><p style="font-family:' + tagFontFamily + ';">' + tagValue +'</span><a class="qstag-tag-remove" id="' + tagIP + '"></a></p></div></li>';
							html+='</ul>'
						}
                }																
				
				$element.empty();
				$element.append(html);
				
				//Generate View - End
				
				
				
				//Action when clicked
				$( ".qstag-tag-remove" ).click(function() {
					var clickedID = this.id;	
					var splittedID = clickedID.split('||-||');
					var fieldName = splittedID[0];
					var selectedValue = splittedID[1];
					var fieldID = splittedID[2];
					var valueID = splittedID[3];
					app.field(fieldName).toggleSelect(selectedValue, true);
					//alert(fieldName+';'+selectedValue);
					//alert(fieldName);
					//alert(selectedValue);
					
					//var arrayIDs = ['{qText: "' + selectedValue + '"}'];				
					//app.field(fieldName).selectValues(arrayIDs, false,true);
					//app.field(fieldName).lock();
					//app.field(fieldName).selectValues([selectedValue], true,true);
					//app.field(fieldName).unlock();
					
					
					/*
					var globalSelectedFieldsLength = globalSelectedFields.length,html = "";
					app.clearAll();
					for (var i = 0; i < globalSelectedFieldsLength; i++) {
						var selectedValues = globalSelectedFields[i].qSelected;
						var splittedSelectedValues = selectedValues.split(", ");
						var valuesArray = [];
						for (var j = 0; j < splittedSelectedValues.length; j++) {
							if ((i != fieldID)||(j!=valueID)) {
								valuesArray[j] = splittedSelectedValues[j];
							}					
						}
						app.field(globalSelectedFields[i].qField).selectValues(valuesArray, true,true);
					}
					*/
					
					
				});	
				
				//Action when clicked - End
				
				
            });														
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
