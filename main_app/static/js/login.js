// Function to validate login form:
var login_btn = document.querySelector(".login_signin_btn");

login_btn.addEventListener("click", validate_login_form);

// Validation function
function validate_login_form() {
	var email = document.getElementById("login_email").value;
	var password = document.getElementById("login_password").value;

	// Error check for empty fields
	if ((email === null || email === "") || (password === null || password === "")) {
		return false;
	};

	// Change button to pressed class and disable it
	login_btn.className += " login_signin_btn_pressed";
	login_btn.disabled = true;

	// Show the loading circle
	var login_loader = document.querySelector(".login_signin_loader_div");
	login_loader.style.display = "flex";

	// Send the data to Python via AJAX Post for validation
	var valid;

	$.ajax ({

		headers: {"X-CSRFToken": csrftoken},
		async: false,
		url: "/login/",
		type: "POST",
		dataType: "json",
		data: {email: email, password: password},
		success: function(result) {
			valid = result.valid
		}
	});

	// Check the result:

	// If validation is successful - redirect to index page:
	if (valid === "true") {

		location.href = "/"
	}

	// Else if validation failed - enable button, remove loading circle and display error message:
	else if (valid === "false") {

		// Delay function
		setTimeout(function() {

			// Remove the pressed class of button
			login_btn.className = login_btn.className.replace(" login_signin_btn_pressed", "")

			// Enable the button
			login_btn.disabled = false;

			// Remove loading circle
			login_loader.style.display = "none";

			// Display error message
			error_msg = document.querySelector(".login_error_message_div");
			error_msg.style.display = "block";

		}, 500);
	};
};

