// Function to error check register form:

register_btn = document.querySelector('.register_btn');

register_btn.addEventListener("click", validate_register_form);

// Validation function:
function validate_register_form() {
	// Add pressed class and disable button
	register_btn.className += " register_btn_pressed";
	//register_btn.disabled = true;

	// Enable the loading circle
	register_loader_div = document.querySelector(".register_loader_div");
	register_loader_div.style.display = "flex";

	// Get the error message box and error message's content
	error_message_box = document.querySelector(".register_error_message_div");
	error_message_content = document.getElementById("register_error_message_content");

	// Get the values of all input fields
	name_elem = document.getElementById("name");
	name_value = document.getElementById("name").value;

	email = document.getElementById("email");
	email_value = document.getElementById("email").value;

	password = document.getElementById("password");
	password_value = document.getElementById("password").value; 

	confirm_password = document.getElementById("confirm_password");
	confirm_password_value = document.getElementById("confirm_password").value;

	fields = [name_elem, email, password, confirm_password]
	values = [name_value, email_value, password_value, confirm_password_value]

	// Remove highlights from any fields that are currently highlighted
	for (var i = 0; i < fields.length; i++) {
		if (fields[i].className === " highlighted_input") {
			fields[i].className = fields[i].className.replace(" highlighted_input", "");
		};
	};

	// Delay function
	setTimeout(function() {

		// Highlight empty fields
		var error = false;

		for (var j = 0; j < values.length; j++) {

			if (values[j] === null || values[j] === "") {

				fields[j].className += " highlighted_input";

				error_message_content.innerHTML = "Please fill in all of the fields"
				error_message_box.style.display = "block";

				error = true;
			};
		};

		if (error === true) {

			register_btn.className = register_btn.className.replace(" register_btn_pressed", "");
			register_loader_div.style.display = "none";

			return false;
		}

		// Check length of password
		password_value = password_value.trim();

		if (password_value.length < 6) {

			password.className += " highlighted_input";

			error_message_content.innerHTML = "Your password must be at least 6 characters long";
			error_message_box.style.display = "block";

			register_btn.className = register_btn.className.replace(" register_btn_pressed", "");
			register_loader_div.style.display = "none";

			return false;
		}

		// Validate if confirm password matches password
		if (password_value != confirm_password_value) {

			password.className += " highlighted_input";
			confirm_password.className += " highlighted_input";

			error_message_content.innerHTML = "Your confirm password must match your password";
			error_message_box.style.display = "block";

			register_btn.className = register_btn.className.replace(" register_btn_pressed", "");
			register_loader_div.style.display = "none";

			return false;
		}

		// Check if email already existed
		var valid;

		$.ajax ({

			headers: {"X-CSRFToken": csrftoken},
			async: false,
			url: "/register/",
			type: "POST",
			dataType: "json",
			data: {name: name_value, email: email_value, password: password_value},
			success: function(result) {
				valid = result.valid
			}
		});

		if (valid === "false") {

			email.className += " highlighted_input";

			error_message_content.innerHTML = "This email address has been taken";
			error_message_box.style.display = "block";

			register_btn.className = register_btn.className.replace(" register_btn_pressed", "");
			register_loader_div.style.display = "none";

			return false;
		}

		else if (valid === "true") {
			location.href = "/";
		}

	}, 500);
};

