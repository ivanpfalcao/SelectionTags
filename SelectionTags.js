var fieldsTranslations = [{
    Label: "",
    Field: ""
}];

var globalSelectedFields; // Global selected fields
var app; // Global app

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
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 50
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
				var tagBackgroundColor='#c2d6d6';
				var tagFontColor='#000000';
				
				for (var i = 0; i < globalSelectedFieldsLength; i++) {
						
						var selectedValues = globalSelectedFields[i].qSelected;
						var splittedSelectedValues = selectedValues.split(", ");
						for (var j = 0; j < splittedSelectedValues.length; j++) {
							var tagValue = globalSelectedFields[i].qField + ' : ' + splittedSelectedValues[j];
							var tagIP = globalSelectedFields[i].qField + '||-||' + splittedSelectedValues[j]+ '||-||' + i + '||-||' + j;
							html+='<ul class="qstag-taglist">';
                     		html+='<li style="background-color:'+ tagBackgroundColor +';color:' + tagFontColor + ';opacity: 1;" data-tag="tag" class="qstag-tag"><div class="qstag-tag-content"><span class="qstag-tag-text">' + tagValue +'</span><a class="qstag-tag-remove" id="' + tagIP + '"></a></div></li>';
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
