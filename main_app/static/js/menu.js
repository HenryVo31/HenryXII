// Scrolling to element for navigation menu:
$(".menu-item-nav-button").click(function() {

	// Get the innerHTML of the li tags
	var menu_item_name = $(this).children().html();

	// Get the position of the clicked element (rounding and making it negative)
	var element_height = $('[id="'+menu_item_name+'"]').offset().top;

	element_height = Math.round(element_height);
	element_height = -Math.abs(element_height);

	// Get the position of the current page
	var current_height = $("html").offset().top;

	// If the difference between the heights is only around 5, stop the function
	if (element_height > current_height) {
		if ((element_height - current_height) < 5) {
			return false;
		}
	}

	else if (element_height < current_height) {
		if ((current_height - element_height) < 5) {
			return false;
		}
	}

	else if (element_height === current_height) {
		return false;
	}

	// Scroll to the clicked element with animation
	$([document.documentElement, document.body]).animate({
		scrollTop: $('[id="'+menu_item_name+'"]').offset().top
	}, 700);
});


// Highlight menu navigation item when clicked:
// Get a list of all the items in the menu navigation panel
var menu_item_btn = document.getElementsByClassName("menu-item-nav-button");

// Loop through every item in this list
for (var i = 0; i < menu_item_btn.length; i++) {

	// For each item, add a Listener to it, tracking when it is clicked
	menu_item_btn[i].addEventListener("click", function() {

		// When clicked, get the current active item
		var current_active_item = document.getElementsByClassName("menu-navigation-item-active")

		// Remove the active class of this currently active item
		current_active_item[0].className = current_active_item[0].className.replace("menu-navigation-item-active", "");

		// Give the active class to the new item that is clicked on
		this.className += " menu-navigation-item-active";
	});
};


// Switch active item in menu navigation when scrolling:
var timeout;

$(window).scroll(function() {
	
	clearTimeout(timeout);
	timeout = setTimeout(function() {

		var current_position = $("html").offset().top;
		current_position = Math.abs(current_position);

		$(".menu-category").each(function(i) {

			var section_position = $(this).offset().top;

			if ((section_position - current_position) <= 50) {
				$(".menu-navigation-item-active").removeClass("menu-navigation-item-active");
				$(".menu-item-nav-button").eq(i).addClass("menu-navigation-item-active");
			};
		});
		
	}, 50);
});


// Opening and closing order panel:
function open_order_panel() {
	document.getElementById("menu-order-arrow-close").style.display = "block";
	document.getElementById("menu-order-arrow-open").style.display = "none";
	
	document.querySelector(".menu-order-panel-innerdiv").style.flex = "23%";
	document.querySelector(".menu-order-panel-innerdiv").style.width = "100%";
};

function close_order_panel() {
	document.getElementById("menu-order-arrow-close").style.display = "none";
	document.getElementById("menu-order-arrow-open").style.display = "block";

	document.querySelector(".menu-order-panel-innerdiv").style.flex = "0";
	document.querySelector(".menu-order-panel-innerdiv").style.width = "0";
};


// Add items to order panel:
// Get all the 'add to order' buttons
var add_to_order_btn = document.getElementsByClassName("add_to_order_btn");

// For each button, assign a function to it when clicked
for (var i = 0; i < add_to_order_btn.length; i++) {

	add_to_order_btn[i].addEventListener("click", check_topping);
};

// Function to check if topping is chosen
function check_topping() {

	// Remove the error message if available
	var toppings_error_message = document.querySelector(".topping_overlay_error_message")

	if (toppings_error_message.parentNode.style.display === "flex") {

		toppings_error_message.parentNode.style.display = "none";
	}

	// Get the topping that the user chosen
	topping_choice_outer = this.parentNode.parentNode.querySelector(".choice-topping")

	if (topping_choice_outer === null) {

		specified_button = this;

		choice_number = 0

		add_menu_order_item(specified_button, choice_number)
	}

	else {

		topping_choice = topping_choice_outer.options[topping_choice_outer.selectedIndex].text;

		if (topping_choice != "No topping(s)") {
			choice_number = topping_choice.replace(" topping(s)", "")

			if (choice_number == "Special") {
				choice_number = 100
			}

			else {
				choice_number = parseInt(choice_number)
			}

			specified_button = this;

			open_topping_overlay(choice_number, specified_button)
		}

		else {
			specified_button = this;

			choice_number = 0

			add_menu_order_item(specified_button, choice_number)
		}
	}
}

// Function to add items to order panel:
function add_menu_order_item(specified_button, choice_number) {

	// Get the name of the item
	var item_name = specified_button.parentNode.parentNode.querySelector(".menu-item-body-head").innerHTML;

	// Get the size of the item
	var item_size_menu = specified_button.parentNode.parentNode.querySelector(".choice-size");

	if (item_size_menu !== null) {

		var item_size = item_size_menu.options[item_size_menu.selectedIndex].text;
	}

	// Get the choice of topping of the item
	var item_choice_menu = specified_button.parentNode.parentNode.querySelector(".choice-topping");

	if (item_choice_menu !== null) {

		var item_choice = item_choice_menu.options[item_choice_menu.selectedIndex].text;
	}

	var item_price = specified_button.parentNode.parentNode.querySelector(".price").querySelector("span").innerHTML;
	item_price = parseFloat(item_price);

	// Add info section
	var td_info = document.createElement('td');
	td_info.className = 'menu-order-info';

	var p_info = document.createElement('p');
	p_info.className = 'menu-order-info-title';
	p_info.innerHTML = item_name;

	td_info.appendChild(p_info);

	if (item_size_menu !== null || item_choice_menu !== null) {

		var span_info = document.createElement('span');
		span_info.className = 'menu-order-info-description';

		if (item_size_menu !== null && item_choice_menu === null) {
			span_info.innerHTML = item_size;
		}

		else if (item_size_menu === null && item_choice_menu !== null) {
			span_info.innerHTML = item_choice;
		}

		else if (item_size_menu !== null && item_choice_menu !== null) {
			span_info.innerHTML = item_size + " - " + item_choice;
		}

		td_info.appendChild(span_info);
	}
	// End info section


	// Add price section
	var td_price = document.createElement('td');
	td_price.className = 'menu-order-price';
	
	td_price_value = item_price;
	td_price.innerHTML = '$ ' + td_price_value;

	// Add item's price to Total price
	var total_value = document.getElementById("menu-order-total-value").innerHTML;
	total_value = parseFloat(total_value);

	var new_total_value = td_price_value + total_value;
	new_total_value = Math.round(new_total_value * 100) / 100;

	document.getElementById("menu-order-total-value").innerHTML = new_total_value;	
	// End price section


	// Add delete section
	var td_delete = document.createElement('td');
	td_delete.className = 'menu-order-remove-button';

	var i_delete = document.createElement('i')
	i_delete.className = 'fa fa-minus-circle menu-order-item-delete-btn';
	i_delete.setAttribute('aria-hidden', 'true');
	i_delete.addEventListener("click", delete_menu_order_item);

	td_delete.appendChild(i_delete);
	// End delete section

	// If the user didn't choose a topping or the pizza doesn't have topping options
	if (choice_number === 0) {

		// Add all the sections into tr and into the table
		var tr = document.createElement('tr');
		tr.className = 'menu-order-table-row';

		tr.appendChild(td_info);
		tr.appendChild(td_price);
		tr.appendChild(td_delete);

		document.getElementById('menu-order-table').appendChild(tr);

		// Add a seperating line
		var tr_seperating_line = document.createElement('tr');
		tr_seperating_line.className = 'menu-order-seperating-line';

		var td_seperating_line = document.createElement('td');
		td_seperating_line.setAttribute('colspan', '3');

		tr_seperating_line.appendChild(td_seperating_line);

		document.getElementById('menu-order-table').appendChild(tr_seperating_line)

		// Open the order panel
		open_order_panel();
	}

	else {

		// Create the item's row
		var tr = document.createElement('tr');
		tr.className = 'menu-order-table-row';

		// Create the toppings' row for the item
		var tr_toppings = document.createElement('tr');
		tr_toppings.className = 'menu-order-toppings-row';

		// Get the chosen toppings and create an element for each one
		picked_toppings_list = document.getElementsByClassName('topping_choice_checkbox');

		for (var i = 0; i < picked_toppings_list.length; i++) {

			if (picked_toppings_list[i].checked) {

				// Create a cell for each topping
				var td_toppings = document.createElement('td');

				// Create a list bullet point for each topping
				var i_plus = document.createElement('i');
				i_plus.className = 'far fa-plus-square';

				// Create a span for each topping
				var span_toppings = document.createElement('span');

				// Get the name of the topping
				var picked_topping = picked_toppings_list[i].nextElementSibling.nextElementSibling.innerHTML;

				// Inside the span, append the name of the topping inside of it
				span_toppings.innerHTML = " " + picked_topping

				// Give the span a class name
				span_toppings.className = "menu-order-toppings-items";

				// Append the topping's info into the cell
				td_toppings.appendChild(i_plus);
				td_toppings.appendChild(span_toppings)

				// If a special toppping is chosen, add a star next to it
				if (choice_number === 100) {
					i_star = document.createElement('i');
					i_star.className = "fas fa-star";
					td_toppings.appendChild(i_star);
				}

				// Append the cell into the toppings' row
				tr_toppings.appendChild(td_toppings);
			}
		}

		// Add all of the elements into the table
		tr.appendChild(td_info);
		tr.appendChild(td_price);
		tr.appendChild(td_delete);

		document.getElementById('menu-order-table').appendChild(tr);
		document.getElementById('menu-order-table').appendChild(tr_toppings);

		// Add a seperating line
		var tr_seperating_line = document.createElement('tr');
		tr_seperating_line.className = 'menu-order-seperating-line';

		var td_seperating_line = document.createElement('td');
		td_seperating_line.setAttribute('colspan', '3');

		tr_seperating_line.appendChild(td_seperating_line);

		document.getElementById('menu-order-table').appendChild(tr_seperating_line)

		// Close toppings overlay
		close_topping_overlay();

		// Open the order panel
		open_order_panel();

		// Uncheck the toppings overlay's checked items
		for (var j = 0; j < picked_toppings_list.length; j++) {
			if (picked_toppings_list[j].checked) {

				picked_toppings_list[j].checked = false;
			}
		}
	}

	// Check whether to disable or enable checkout button
	check_checkout_btn();
}


// Open topping overlay
function open_topping_overlay(choice_number, specified_button) {

	// Disables scrolling for the body
	document.querySelector("body").className = "stop-scrolling";

	// Activate the overlay
	menu_topping_overlay = document.querySelector(".menu-toppings-overlay");
	menu_topping_overlay.style.display = "flex";

	topping_overlay_header = menu_topping_overlay.querySelector("header");

	// Create a suitable heading for the overlay
	if (choice_number == 1) {
		topping_overlay_header.innerHTML = "Choose " + choice_number + " topping"
	}

	else if (choice_number == 100) {
		topping_overlay_header.innerHTML = "Choose a Special topping"
	}

	else {
		topping_overlay_header.innerHTML = "Choose " + choice_number + " toppings"
	}

	process_topping(choice_number, specified_button)
}

// Close topping overlay
function close_topping_overlay() {

	// Enables scrolling for body
	document.querySelector("body").className = "";

	// Close the overlay
	document.querySelector(".menu-toppings-overlay").style.display = "none";
}

// Check if user chose the correct amount of toppings
function process_topping(choice_number, specified_button) {

	var topping_overlay_button = document.querySelector(".topping_overlay_button")

	// Add event listener to confirm button
	topping_overlay_button.addEventListener("click", function () {

		var checkbox_number = 0;

		var topping_choice_list = document.getElementsByClassName("topping_choice_checkbox")

		for (var i = 0; i < topping_choice_list.length; i++) {

			if (topping_choice_list[i].checked) {

				if (topping_choice_list[i].parentNode.querySelector(".special_topping_star")) {

					checkbox_number += 100;
				}

				else {
					checkbox_number += 1;
				}
			}
		}

		// Get the topping overlay error message box
		var topping_error_message = document.querySelector(".topping_overlay_error_message")

		// Check if the number of toppings chosen is valid
		if (choice_number === checkbox_number) {
			add_menu_order_item(specified_button, choice_number)
		}

		// If the number of toppings chosen is invalid, then show an error message
		else {
			
			if (choice_number === 100) {

				topping_error_message.innerHTML = "Please choose " + 1 + " Special topping.";
				topping_error_message.parentNode.style.display = "flex";
			}

			else if (choice_number === 1) {

				topping_error_message.innerHTML = "Please choose " + choice_number + " Normal topping.";
				topping_error_message.parentNode.style.display = "flex";
			}

			else {

				topping_error_message.innerHTML = "Please choose " + choice_number + " Normal toppings.";
				topping_error_message.parentNode.style.display = "flex";
			}
		}
	})
}


// Delete items in order panel:
var item_delete_btn = document.getElementsByClassName('menu-order-item-delete-btn');

for (var i = 0; i < item_delete_btn.length; i++) {
	item_delete_btn[i].addEventListener("click", delete_menu_order_item);
};

// Function to delete items in order panel:
function delete_menu_order_item() {

	var parent_div = this.parentNode.parentNode;

	// Get the new total value
	var delete_item_price = parent_div.querySelector('.menu-order-price').innerHTML;
	delete_item_price = delete_item_price.replace('$', "");
	delete_item_price = parseFloat(delete_item_price);

	delete_total_value = document.getElementById('menu-order-total-value').innerHTML;
	delete_total_value = parseFloat(delete_total_value);

	new_delete_total_value = delete_total_value - delete_item_price;
	new_delete_total_value = Math.round(new_delete_total_value * 100) / 100;

	document.getElementById('menu-order-total-value').innerHTML = new_delete_total_value;

	// Removing the items:

	// If the user chose toppings with the item, remove the toppings too
	if (parent_div.nextElementSibling.className === "menu-order-toppings-row") {

		parent_div.parentNode.removeChild(parent_div.nextElementSibling);
	}

	// Remove the seperating line
	parent_div.parentNode.removeChild(parent_div.nextElementSibling);

	// Remove the item itself
	parent_div.parentNode.removeChild(parent_div);

	// Check whether to enable or disable checkout button accordingly
	check_checkout_btn();	
}


// When page loads, run update_item() function
window.onload = update_item();

// When a new size is chosen, run update_item() function
var size_dropdown = document.getElementsByClassName("choice-size");

for (var i = 0; i < size_dropdown.length; i++) {
	size_dropdown[i].addEventListener("change", update_item);
}

// When a new topping is chosen, run update_item() function
var topping_dropdown = document.getElementsByClassName("choice-topping");

for (var j = 0; j < topping_dropdown.length; j++) {
	topping_dropdown[j].addEventListener("change", update_item);
}


// Function to calculate prices for each item
function update_item() {
	outer_item_div = document.getElementsByClassName("menu-item-outer-div");

	for (var i = 0; i < outer_item_div.length; i++) {

		chosen_pizza = outer_item_div[i].querySelector(".menu-item-body-head").innerHTML;

		if (outer_item_div[i].querySelector(".choice-size") !== null) {

			chosen_size = outer_item_div[i].querySelector(".choice-size").value;
		}

		else {

			chosen_size = "null"
		}

		if (outer_item_div[i].querySelector(".choice-topping") !== null) {

			chosen_topping = outer_item_div[i].querySelector(".choice-topping").value
		}

		else {

			chosen_topping = "null"
		}

		price_div = outer_item_div[i].querySelector(".price").querySelector("span")

		var chosen_price;

		$.ajax ({

			headers: {"X-CSRFToken": csrftoken},
			async: false,
			url: "/menu/",
			type: "POST",
			dataType: "json",
			data: {chosen_pizza: chosen_pizza, chosen_size: chosen_size, chosen_topping: chosen_topping},
			success: function(result) {
				chosen_price = result.chosen_price;
			}
		})

		price_div.innerHTML = chosen_price;

	}
}


// Configure button to close topping's overlay
var overlay_close_btn = document.querySelector(".topping_overlay_closing_button");

overlay_close_btn.addEventListener("click", function() {

	close_topping_overlay();
});


// Configure the Checkout button
var checkout_btn = document.querySelector(".menu-checkout-button")

checkout_btn.addEventListener("click", open_delivery_overlay);


// Open delivery overlay
function open_delivery_overlay() {

	document.querySelector(".checkout-overlay-outerdiv").style.display = "flex";
}


// Close delivery overlay
var delivery_overlay_close_btn = document.querySelector(".delivery-overlay-closing-btn")

delivery_overlay_close_btn.addEventListener("click", function () {

	document.querySelector(".checkout-overlay-outerdiv").style.display = "none";
})


// Check the inputs in delivery overlay, and if they are valid, open payment methods overlay
var payment_methods_overlay_open_btn = document.querySelector(".delivery-overlay-continue-btn");

payment_methods_overlay_open_btn.addEventListener("click", function() {

	remove_highlight_delivery_overlay()

	// Get error box
	var delivery_overlay_error_div = document.querySelector(".delivery-overlay-error-div")

	// Get list of inputs
	var delivery_overlay_input_list = document.getElementsByClassName("delivery-overlay-input")

	// Flag for errors
	var delivery_overlay_error_flag = false;

	// Loop through list of inputs
	for (var i = 0; i < delivery_overlay_input_list.length; i++) {

		if (delivery_overlay_input_list[i].value === null || delivery_overlay_input_list[i].value === "") {

			delivery_overlay_error_div.style.display = "block";

			delivery_overlay_input_list[i].className += " delivery-overlay-input-highlight";

			delivery_overlay_error_flag = true;
		}
	}

	if (delivery_overlay_error_flag === true) {

		return false;
	}

	else {

		document.querySelector(".payment-methods-overlay-div").style.display = "block";

		document.querySelector(".delivery-overlay-div").style.display = "none";
	}
})


// Remove all highlighted inputs in delivery overlay
function remove_highlight_delivery_overlay() {

	// Get error box
	var remove_delivery_overlay_error_div = document.querySelector(".delivery-overlay-error-div");

	// Remove error box
	remove_delivery_overlay_error_div.style.display = "none";

	// Get list of inputs
	var remove_delivery_overlay_input_list = document.getElementsByClassName("delivery-overlay-input");

	// Loop through list of inputs and removing all highlighted inputs
	for (var i = 0; i < remove_delivery_overlay_input_list.length; i++) {

		if (remove_delivery_overlay_input_list[i].className != "delivery-overlay-input") {

			remove_delivery_overlay_input_list[i].className = remove_delivery_overlay_input_list[i].className.replace(" delivery-overlay-input-highlight", "")
		}
	}
}


// Close payment methods overlay and goes back to delivery overlay
var payment_methods_overlay_close_btn = document.querySelector(".payment-methods-closing-btn") 

payment_methods_overlay_close_btn.addEventListener("click", function() {

	document.querySelector(".delivery-overlay-div").style.display = "block";

	document.querySelector(".payment-methods-overlay-div").style.display = "none";
})


// Finalizing and receiving payments:

// Payment by cash:
var payment_methods_cash_btn = document.querySelector(".payment-methods-cash-btn");

payment_methods_cash_btn.addEventListener("click", create_new_order);


// Payment by credit card:
var payment_methods_creditcard_btn = document.querySelector(".payment-methods-creditcard-btn");

payment_methods_creditcard_btn.addEventListener("click", function() {

	document.querySelector(".payment-info-overlay-div").style.display = "block";

	document.querySelector(".payment-methods-overlay-div").style.display = "none";

	remove_highlight_payment_info()
})


// Close payment info overlay and return to payment methods overlay
var payment_info_close_btn = document.querySelector(".payment-info-closing-btn");

payment_info_close_btn.addEventListener("click", function() {

	document.querySelector(".payment-methods-overlay-div").style.display = "block";

	document.querySelector(".payment-info-overlay-div").style.display = "none";
})


// Submitting the credit card info and checking for errors
var payment_info_confirm_btn = document.querySelector(".payment-info-confirm-btn");

payment_info_confirm_btn.addEventListener("click", function() {

	remove_highlight_payment_info()

	// Get the error box
	var payment_info_error_box = document.querySelector(".payment_info_overlay_error_div")

	// Get the list of inputs
	var payment_info_list = document.getElementsByClassName("payment_info_value");

	// Flag for errors
	payment_info_error_flag = false;

	// Loop through the inputs and assign errors appropriately
	for (var i = 0; i < payment_info_list.length; i++) {

		if (payment_info_list[i].value === null || payment_info_list[i].value === "") {

			payment_info_error_box.style.display = "block";

			payment_info_list[i].className += " payment_info_input_highlight";

			payment_info_error_flag = true;
		}
	}

	if (payment_info_error_flag === true) {

		return false;
	}

	else {

		create_new_order()
	}
})


// Remove all error highlights in payment info overlay:
function remove_highlight_payment_info() {

	// Get the error box
	var remove_payment_info_error_box = document.querySelector(".payment_info_overlay_error_div")

	// Remove the error box
	remove_payment_info_error_box.style.display = "none";

	// Get the list of inputs
	var remove_payment_info_list = document.getElementsByClassName("payment_info_value");

	// Remove all highlights from inputs
	for (var i = 0; i < remove_payment_info_list.length; i++) {

		if (remove_payment_info_list[i].className != "payment_info_value") {

			remove_payment_info_list[i].className = remove_payment_info_list[i].className.replace(" payment_info_input_highlight", "")
		}
	}
}


// Assign exit button in error panel
var order_error_exit = document.querySelector(".order_error_exit")
order_error_exit.addEventListener("click", function() {

	document.querySelector(".checkout-overlay-outerdiv").style.display = "none";
	
	document.querySelector(".order_error_div").style.display = "none";

	document.querySelector(".delivery-overlay-div").style.display = "block";
});


// Function to check whether table is empty and disable checkout button accordingly
function check_checkout_btn() {

	if (document.getElementById("menu-order-table").rows.length == 0) {

		document.querySelector(".menu-checkout-button").disabled = true;
		document.querySelector(".menu-checkout-button").className += " disabled_checkout_btn";
	}

	else {
		document.querySelector(".menu-checkout-button").disabled = false;
		document.querySelector(".menu-checkout-button").classList.remove("disabled_checkout_btn");
	}
}

// Disable checkout button when page loads
document.addEventListener("DOMContentLoaded", function() {
	check_checkout_btn();
})

// Create a new order
function create_new_order() {

	var check_result;

	$.ajax ({
		headers: {"X-CSRFToken": csrftoken},
		async: false,
		url: "/orders/",
		type: "POST",
		dataType: "json",
		data: {
			sent: "sent",
			},
		success: function(result) { 
			check_result = result["status"]
		}
	});

	if (check_result == "fail") {

		document.querySelector(".order_error_div").style.display = "block";

		document.querySelector(".payment-methods-overlay-div").style.display = "none";

		document.querySelector(".payment-info-overlay-div").style.display = "none";

		return;
	}

	// Get customer's info
	customer_address = document.getElementById("customer_street_address").value
	customer_city = document.getElementById("customer_city").value
	customer_country = document.getElementById("customer_country").value
	customer_phone_number = document.getElementById("customer_phone_number").value
	customer_notes = document.getElementById("customer_notes").value
	total_price = document.getElementById("menu-order-total-value").innerHTML

	// Send customer's info to Python
	$.ajax ({
		headers: {"X-CSRFToken": csrftoken},
		async: false,
		url: "/add_customer_info/",
		type: "POST",
		dataType: "json",
		data: {
			customer_address: customer_address,
			customer_city: customer_city,
			customer_country: customer_country,
			customer_phone_number: customer_phone_number,
			customer_notes: customer_notes,
			total_price: total_price,
			},
		success: function(result) {
		}
	});

	// Get the list of items inside the orders panel
	var orders_items_list = document.getElementsByClassName("menu-order-table-row");

	// Loop through the list of items
	for (var i = 0; i < orders_items_list.length; i++) {

		// Get the item's name
		var orders_items_name = orders_items_list[i].querySelector(".menu-order-info-title").innerHTML;

		// Get the item's price
		var orders_items_price = orders_items_list[i].querySelector(".menu-order-price").innerHTML;

		orders_items_price = orders_items_price.replace("$ ", "");

		orders_items_price = parseFloat(orders_items_price);

		// Get the item's size
		var orders_items_size = "";

		try {

			orders_items_list[i].querySelector(".menu-order-info-description").innerHTML;
		}

		catch(err) {

			orders_items_size = "none"
		}

		if (orders_items_size != "none") {

			var orders_items_description = orders_items_list[i].querySelector(".menu-order-info-description").innerHTML;

			for (var j = 0; j < orders_items_description.length; j++) {

				if (orders_items_description[j] == " ") {

					break;
				}

				orders_items_size += orders_items_description[j];
			}

			orders_items_size = orders_items_size.toLowerCase();
		}

		// Get the item's toppings
		var orders_items_toppings_choices = [];

		var orders_items_toppings_row = orders_items_list[i].nextElementSibling;

		if (orders_items_toppings_row.className === "menu-order-toppings-row") {

			var orders_items_toppings_list = orders_items_toppings_row.getElementsByClassName("menu-order-toppings-items");

			for (var k = 0; k < orders_items_toppings_list.length; k++) {

				orders_items_toppings_list[k].innerHTML = orders_items_toppings_list[k].innerHTML.replace(" ", "");

				orders_items_toppings_choices.push(orders_items_toppings_list[k].innerHTML);
			}
		}

		else {

			orders_items_toppings_choices.push("none");
		}

		// Convert the toppings list into a string
		orders_items_toppings_choices = orders_items_toppings_choices.join(", ")

		// Send data to Python for adding into the database
		$.ajax ({
			headers: {"X-CSRFToken": csrftoken},
			async: false,
			url: "/add_orders/",
			type: "POST",
			dataType: "json",
			data: {
				orders_items_name: orders_items_name,
				orders_items_size: orders_items_size,
				orders_items_price: orders_items_price,
				orders_items_toppings_choices: orders_items_toppings_choices
				},
			success: function(result) { 
			}
		});
	}

	// Clear order table and reset total
	while (document.getElementById("menu-order-table").lastElementChild) {
		document.getElementById("menu-order-table").removeChild(document.getElementById("menu-order-table").lastElementChild);
	}

	document.getElementById("menu-order-total-value").innerHTML = 0;

	// Go to Orders page
	document.querySelector(".orders_button").click();
}


