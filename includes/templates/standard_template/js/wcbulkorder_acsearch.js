jQuery(document).ready(function ($){

	var acs_action = 'myprefix_autocompletesearch';
	//WCBulkOrder.aftertypequantity
	//WCBulkOrder.nodatafound
	//WCBulkOrder.noproductselected
	//WCBulkOrder.beforetypelabel
	//WCBulkOrder.beforetypequanity
	WCBulkOrder.category = $('#BulkOrderForm').attr('category');
	WCBulkOrder.included = $('#BulkOrderForm').attr('included');
	WCBulkOrder.excluded = $('#BulkOrderForm').attr('excluded');
	function autocomplete() {
		$("input.wcbulkorderproduct").autocomplete({
			source: function(req, response){
				$.getJSON(WCBulkOrder.url+'?callback=?&action='+acs_action+'&category='+WCBulkOrder.category+'&included='+WCBulkOrder.included+'&excluded='+WCBulkOrder.excluded+'&_wpnonce='+WCBulkOrder.search_products_nonce, req, response);
			},
			select: function(event, ui) {

				var $input = $(this);
				var $quantityInput = ($input).parent().siblings().find(".wcbulkorderquantity");
				var $displayPrice = ($input).parent().siblings().find(".wcbulkorderprice");
				var $ProdID = $('.wcbulkorderid', $input.parent().parent());
				$quantityInput.attr("placeholder", "Enter Quantity");
				$ProdID.val(ui.item.id);
				$quantityInput.off('keyup').on('keyup', function() {
					window.symbol = ui.item.symbol;
					if ($quantityInput.val() > 0) {
						var total = parseInt($quantityInput.val()) * ui.item.price;
					}
					else {
						var total = 0;
					}
					$displayPrice.val(total.toFixed(2));
					$('.wcbulkorderpricetotal').html(symbol + "0.00");
					calculateTotal();

				});
			},
			minLength: 2,
			delay: 500,
			search: function(event, ui) {
				var $input = $(this);
				var $spinner = $('.bulkorder_spinner', $input.parent());
		       	$spinner.show();
		   	},
			response: function(event, ui) {
				$('.bulkorder_spinner').hide();
				// ui.content is the array that's about to be sent to the response callback.
				if ((ui.content == null) || (ui.content === 0)){
					var $input = $(this);
					var $quantityInput = ($input).parent().siblings().find(".wcbulkorderquantity");
					var $displayPrice = ($input).parent().siblings().find(".wcbulkorderprice");
					$input.val("");
					$input.attr("placeholder", "No Products Found");
					$displayPrice.val("");
					$quantityInput.val("");
					calculateTotal();
				}
			},
		}).each(function(){
			$(this).data("ui-autocomplete")._renderItem = function (ul, item) {
				return $( "<li>" )
				.append( "<a>" + "<img class='wcbof_autocomplete_img' src='" + item.imgsrc + "' />" + item.label+ "</a>" )
				.appendTo( ul );
			}
		});
	}

	function calculateTotal() {
		var sum = 0;
		$(".wcbulkorderprice").each(function() {
			var $item = parseFloat($(this).val());
			if( $item > 0) {
				sum += $item;
				if (sum) {
					$('.wcbulkorderpricetotal').html('$' + parseFloat(sum).toFixed(2));
				}
			}
		});
	}

	$('.wcbulkorderprice').on('blur', function() {
		var item = $(this).parent().siblings().find('input.wcbulkorderproduct');
		if (item.val() == '') {
			$(this).val('');
		} else {
			calculateTotal();
		}
	});

	$("input.wcbulkorderproduct").click(autocomplete);
	$("button.wcbulkordernewrow").live('click', function() {
		var $totalinput = $("tr:last").html();
		$("tbody.wcbulkorderformtbody").append('<tr class="wcbulkorderformtr"><td style="width: 60%"><i class="bulkorder_spinner"></i><input type="text" name="wcbulkorderproduct[]" class="wcbulkorderproduct" style="width: 100%"></td><td style="width: 20%"><input type="text" name="wcbulkorderquantity[]" class="wcbulkorderquantity" style="width: 100%"></td><input type="hidden" name="wcbulkorderid[]" class="wcbulkorderid" value=""></tr>');
		autocomplete();
		return false;
	});
	$("button.wcbulkordernewrowprice").live('click', function() {
		var $totalinput = $("tr:last").html();
		$("tbody.wcbulkorderformtbody").append('<tr class="wcbulkorderformtr"><td style="width: 60%"><i class="bulkorder_spinner"></i><input type="text" name="wcbulkorderproduct[]" class="wcbulkorderproduct" style="width: 100%"></td><td style="width: 20%"><input type="text" name="wcbulkorderquantity[]" class="wcbulkorderquantity" style="width: 100%"></td><td style="width: 20%"><input type="text" name="wcbulkorderprice[]" class="wcbulkorderprice" style="width: 100%" /></td><input type="hidden" name="wcbulkorderid[]" class="wcbulkorderid" value=""></tr>');
		autocomplete();
		return false;
	});

});
