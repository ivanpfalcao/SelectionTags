var fieldsTranslations = [{
    Label: "",
    Field: ""
}];

var mySelectedFields; // Global selected fields
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
			
			//XXXX
			app = qlik.currApp(this);
			var selectionState = app.selectionState;
            var selections = app.getList("CurrentSelections", function(reply) {
				mySelectedFields = reply.qSelectionObject.qSelections;
				var mySelectedFieldsLength = mySelectedFields.length,html = "";
				
				
				//html+='<li style="opacity: 1;" data-tag="tag" class="mb-tag"><div class="mb-tag-content"><span class="mb-tag-text">tag</span><a class="mb-tag-remove"></a></div></li>';
				//html+='<li style="opacity: 1;" data-tag="tag" class="mb-tag"><div class="mb-tag-content"><span class="mb-tag-text">tag</span><a class="mb-tag-remove"></a></div></li>';
				//html+='<li style="opacity: 1;" data-tag="tag" class="mb-tag"><div class="mb-tag-content"><span class="mb-tag-text">tag</span><a class="mb-tag-remove"></a></div></li>';
				for (var i = 0; i < mySelectedFieldsLength; i++) {
						
						var selectedValues = mySelectedFields[i].qSelected;
						var splittedSelectedValues = selectedValues.split(", ");
						for (var j = 0; j < splittedSelectedValues.length; j++) {
							//var tagValue = mySelectedFields[i].qField + ' : ' + mySelectedFields[i].qSelected;
							var tagValue = mySelectedFields[i].qField + ' : ' + splittedSelectedValues[j];
							html+='<div class="mb-container"><ul class="mb-taglist">';
                     		html+='<li style="opacity: 1;" data-tag="tag" class="mb-tag"><div class="mb-tag-content"><span class="mb-tag-text">' + tagValue +'</span><a class="mb-tag-remove"></a></div></li>';
							html+='</ul></div>'
						}
                }
				
				
				
				
			
				/*
                html += '<table id="mySelections" class="qv-object-currentSelections"><tr><th>Field</th><th>Count</th><th>Values</th></tr>';
                for (var i = 0; i < mySelectedFieldsLength; i++) {
                     html += "<tr onclick='removeMySelection(" + i + ");'><td>" + translateField(mySelectedFields[i].qField) + '</td><td>' + mySelectedFields[i].qSelectedCount + ' of ' + mySelectedFields[i].qTotal + '</td><td>' + mySelectedFields[i].qSelected + '</td></tr>';
                }
                html += '</table>';	
				
				*/
				
				$element.empty();
				$element.append(html);
            });
			
			//XXXX			
			
			
			
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );


function removeMySelection(index) {
    app.clearAll();
    var mySelectedFieldsLength = mySelectedFields.length;
    var selectedFields = mySelectedFields.slice();
    for (var i = 0; i < mySelectedFieldsLength; i++) {
        if (i == index) {
            continue;
        }
        var field = selectedFields[i].qField;
        var fieldSelectionInfoLength = selectedFields[i].qSelectedFieldSelectionInfo.length;
        var names = [];
        for (var j = 0; j < fieldSelectionInfoLength; j++) {
            var name = selectedFields[i].qSelectedFieldSelectionInfo[j].qName;
            if (isNaN(name)) {
                names[j] = name;
            } else {
                names[j] = parseInt(name);
            }
        }
        app.field(field).selectValues(names, false, true)
    }
}

function translateField(field) {
    var size = fieldsTranslations.length;
    for (var i = 0; i < size; i++) {
        if (fieldsTranslations[i].Field == field) {
            return fieldsTranslations[i].Label;
        }
    }
    return field;
}
