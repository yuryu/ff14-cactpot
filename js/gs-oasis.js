/*

The MIT License (MIT)

Copyright (c) 2015 Yuryu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var payout = [
	NaN, NaN, NaN, NaN, NaN, NaN, 
	10000, 36, 720, 360, 80, 252, 108, 72,
	54, 180, 72, 180, 119, 36, 306, 1080, 144, 1800, 3600
];

var size = 3;
var requiredNums = 4;
var payoutMin = 6;
var payoutMax = 24;
var payoutNum = payoutMax - payoutMin + 1;

var currentScrollPosition = 0;

function createOptions(n) {
	var result = "<option value='0' selected='selected'>0</option>";
	for ( var i = 1; i <= n; i++ ) {
		result += "<option value='" + i + "'>" + i + "</option>"
	}
	return result;
}

function rowColStr(row, col) {
	return "r" + row + "c" + col;
}

function validateScratch() {
	var ints = {};
	var count = 0;
	var success = true;
	for ( var i = 0; i < size * size; i++ ) {
		var v = parseInt($("#scratch select[name='" + i + "'] option:selected").val());
		$("#scratch select[name='" + i + "']").parent()
			.removeClass("has-error").removeClass("success")
			.removeClass("danger");
		if ( v != 0 ) {
			if ( ints[v] ) {
				ints[v].forEach(function(v, i, a){
					$("#scratch select[name='" + v + "']").parent()
						.addClass("has-error").addClass("danger");
				});
				$("#scratch select[name='" + i + "']").parent()
					.addClass("has-error").addClass("danger");
				success = false;
			}
			ints[v] = [i];
			count++;
		}
	}
	if ( count > requiredNums ) {
		for ( var i in ints ) {
			if ( ints.hasOwnProperty(i) ) {
				ints[i].forEach(function(v, i, a){
					$("#scratch select[name='" + v + "']").parent()
						.addClass("has-error").addClass("danger");
				});
			}
		}
	}
	return count == requiredNums && success;
}

function createScratch(table) {
	var c = 0;
	var options = createOptions(size * size);
	for (var row = 0; row < size; row++ ) {
		var tr = $("<tr id='row" + row + "'></tr>").appendTo(table);
		tr.append("<td id='er" + row + "' class='exp'></td>")
		for ( var col = 0; col < size; col++) {
			tr.append("<td id='" + rowColStr(row, col) + "'><select name='" + c + "' class='form-control'>"
				+ options + "</select></td>");
			c++;
		}
	}
	$("#scratch select").change(function() {
		if ( validateScratch() ) {
			solveScratch();
			$("#scratchform input[name='solve']").removeAttr("disabled");
		} else {
			$("#scratch .exp").removeClass("success");
			$("#scratch .exp").html("&nbsp;");
			$("#scratchform input[name='solve']").attr("disabled", "disabled");
		}
	});
}



function highlightHorizontal(row) {
	for ( var i = 0; i < size; i++ ) {
		$("#" + rowColStr(row, i)).addClass("success");
	}
}

function highlightVertical(col) {
	for ( var i = 0; i < size; i++ ) {
		$("#" + rowColStr(i, col)).addClass("success");
	}
}

function highlightDiagonal(dir) {
	for ( var i = 0 ; i < size; i++ ) {
		var col = i;
		if ( dir == 1 ) {
			col = size - i - 1;
		}
		$("#" + rowColStr(i, col)).addClass("success");
	}
}

function solveScratch() {
	parsePayout();
	var row;
	var table = [];
	for ( var i = 0; i < size * size; i++ ) {
		if ( i % size == 0 ) {
			row = [];
			table.push(row);
		}
		row.push(parseInt($("#scratch select[name='" + i + "'] option:selected").val()));
	}
	var solver = new Solver();
	var result = solver.solve(table, payout);
	var maxindex = 0;
	var maxvalue = 0;	
	for ( var i = 0; i < result.length; i++ ) {
		if ( i < size ) {
			$("#er" + i).text(Math.floor(result[i]));
		} else if ( i < size * 2 ) {
			$("#ec" + (i - size)).text(Math.floor(result[i]));
		} else {
			$("#ed" + (i - size * 2)).text(Math.floor(result[i]));
		}
		if ( maxvalue < result[i] ) {
			maxindex = i;
			maxvalue = result[i];
		}
	}
	$("#scratch .exp").removeClass("success");
	if ( maxindex < size ) {
		highlightHorizontal(maxindex);
		$("#er" + maxindex).addClass("success");
	} else if ( maxindex < size * 2 ) {
		highlightVertical(maxindex - size);
		$("#ec" + (maxindex - size)).addClass("success");
	} else {
		highlightDiagonal(maxindex - size * 2);
		$("#ed" + (maxindex - size * 2)).addClass("success");
	}

}

function resetScratch() {
	$("#scratch td").removeClass("has-error").removeClass("success")
			.removeClass("danger");
	$("#scratchform input[name='solve']").attr("disabled", "disabled");
	$("#scratch select").val("0");
	$("#scratch .exp").html("&nbsp;");
	$("#scratch .exp").removeClass("success");
}

function createPayoutCells(n) {
	return "<th><label for='p" + n + "'>" + n + "</label></th>" +
	"<td><input type='text' class='form-control' id='p" + n + 
	"' value='" + payout[n] + "'></td>";
}

function createPayout(table) {
	for ( var i = payoutMin; i < payoutMin + Math.floor((payoutNum) / 2); i++ ) {
		table.append("<tr>" + createPayoutCells(i) + 
			createPayoutCells(i + Math.floor((payoutNum) / 2) + 1) + "</tr>");
	}
	if ( payoutNum % 2 == 1 ) {
		var p = Math.floor(payoutNum / 2) + payoutMin;
		table.append("<tr>" + createPayoutCells(p) + "<th></th><td></td></tr>");
	}
}

function parsePayout() {
	for ( var i = payoutMin; i <= payoutMax; i++ ) {
		payout[i] = parseInt($("#p" + i).val());
	}
}

$(document).ready(function() {
	createScratch($("#scratch tbody"));
	createPayout($("#payout tbody"));
	var i18nopts = { 
		fallbackLng: 'en',
		detectLngQS: 'lang',
		resGetPath: 'locales/__ns__-__lng__.json'
	};
	i18n.init(i18nopts, function (t) {
			$("title").text(t("title"));
			$('.i18n').i18n();
	});
	$(document).scroll(function(){
    	currentScrollPosition = $(this).scrollTop();
	});
	$("#scratch select").focus(function () {
		$(document).scrollTop(currentScrollPosition);
	});
});