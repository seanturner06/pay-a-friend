// Ensure the DOM is fully loaded before trying to access the elements
document.addEventListener('DOMContentLoaded', function () {
    //Loads an image preview
    document.getElementById('file').addEventListener('change', function () {
        console.log('File input changed'); // Check if this message appears in the console
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log('File read completed'); // Check if file reading is successful
                document.getElementById('image-preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    const form = document.getElementById('form');
    // form.setAttribute('novalidate');
    // Regex for name validation
    const nameRegex = /^[a-zA-Z ]+$/;
    // Regex for ccv
    const ccvRegex = /^\d{3,4}$/;
    // Regex for email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regex for phone number (Us numbers)
    const smsRegex = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;

    // Contains all of the fields required for the form to be submitted
    const inputs = form.querySelectorAll('input[required], select[required], textarea');

    // Add blur event listener to all required fields
    inputs.forEach(function (input) {
        input.addEventListener('blur', function (e) {
            // Check if the input is valid
            const isInputValid = validateInput(input);
            // If the input is not valid then the form is not valid
            if (isInputValid === false) {
                this.classList.add('is-invalid');
                e.preventDefault();
            } else {
                this.classList.remove('is-invalid');
            }
        });
    });

    // Add event listener for ccv to remove any character that is not a digit
    document.getElementById('card-ccv').addEventListener('input', function (e) {
        // removes each non-digit characters from the input value
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Add event listener for the card number 
    document.getElementById('card-number').addEventListener('input', function (e) {
        // Get the current input value
        let inputValue = e.target.value;

        // Remove all non-digit characters from the input value
        let numericValue = inputValue.replace(/\D/g, '');

        // Add hyphens every 4 digits
        let formattedInputValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1-');

        // Update the input field with the formatted value
        e.target.value = formattedInputValue;
    });

    form.addEventListener('submit', function (e) {
        // Keeps track of whether the form is valid or not
        let isValid = true;

        // Validate basic checks for each input field
        inputs.forEach(function (input) {
            // Holds true if the input is valid, false if not
            const isInputValid = validateInput(input);
            // If the input is not valid then the form is not valid
            if (isInputValid === false) {
                isValid = false;
            }
        });

        // Validate more complex checks for some input fields
        const sfirstname = document.getElementById('sfirstname').value.trim();
        const slastname = document.getElementById('slastname').value.trim();
        const rfirstname = document.getElementById('rfirstname').value.trim();
        const rlastname = document.getElementById('rlastname').value.trim();
        //Restricted user variant 1
        const restrictedUserStuart = "Stuart Dent";
        // Restricted user variant 2
        const restrictedUserStu = "Stu Dent";

        // sender full name
        const sfullname = sfirstname + " " + slastname;
        // recipient full name
        const rfullname = rfirstname + " " + rlastname;

        // Check to see if the sender is a restricted user 
        if (sfullname === restrictedUserStuart || sfullname === restrictedUserStu) {
            alert("Sorry but you are a restricted user");
            isValid = false;
            // let tempElement = document.getElementById('fullname-invalid');
            // tempElement.style.display = isValid ? 'none' : 'inline-block';
        }

        // Check to see if the recipient is a restricted user
        if (rfullname === restrictedUserStuart || rfullname === restrictedUserStu) {
            alert("Sorry but the person you are attempting to send payment to is a restricted user");
            isValid = false;
        }

        // Check to see if one of the notification methods is selected
        if (document.getElementById('email-option').checked === false &&
            document.getElementById('sms-option').checked === false &&
            document.getElementById('no-option').checked === false) {
            document.getElementById('notify-method-invalid').style.display = 'inline-block';
            isValid = false;
        } else {
            document.getElementById('notify-method-invalid').style.display = 'none';
        }
        // If the user selected a notification method of sms then verify a valid phone number is entered
        if (document.getElementById('sms-option').checked === true) {
            let sms = document.getElementById('sms').value.trim();
            // If the input is null or empty then let the user know that the phone number is required
            if (sms === null || sms.length === 0) {
                document.getElementById('sms-invalid').style.display = 'inline-block';
                isValid = false;
            } else {
                document.getElementById('sms-invalid').style.display = 'none';
            }
            // If the phone number is not valid then let the user know
            // TODO: Check to see if the phone number is valid
        } else {
            document.getElementById('sms-invalid').style.display = 'none';
        }
        // If the user selected a notification method of email then verify a valid email is entered
        if (document.getElementById('email-option').checked === true) {
            let email = document.getElementById('email').value.trim();
            // If the input is null or empty then let the user know that the email is required
            if (email === null || email.length === 0) {
                document.getElementById('email-invalid').style.display = 'inline-block';
                isValid = false;
            } else {
                document.getElementById('email-invalid').style.display = 'none';
            }
            // If the email is not valid then let the user know
            // TODO: Check to see if the email is valid
        } else {
            document.getElementById('email-invalid').style.display = 'none';
        }

        // If the form is invalid then prevent the form from submitting
        if (isValid === false) {
            console.log('Form is not valid');
            e.preventDefault();
        }
    });

    // Validates all input fields
    function validateInput(input) {
        // Keeps track of whether the input is valid or not
        let isValid = true;
        // Gets the id of the feedback element
        const feedbackId = input.id + '-invalid';
        // Contains the feedback element
        const feedbackElement = document.getElementById(feedbackId);

        console.log(input.id + " " + input.value);

        // Checks to see if the input is empty, if so then it displays a message
        // saying the field is required
        if (input.value === '') {
            isValid = false;
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
            return false;
        }

        // Validate all name fields
        if (input.dataset.validationType === 'name') {
            isValid = nameRegex.test(input.value);
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
        }
        // Validate message
        if (input.dataset.validationType === 'message-box') {
            isValid = input.value.length >= 10;
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
        }
        // Validate card type
        if (input.dataset.validationType === 'card-type') {
            // If input is empty then set the validity
            isValid = input.value !== '';
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
        }
        // Validate card number
        if (input.dataset.validationType === 'card-number') {
            // Replace card number with dashes with no dashes to properly validate the card number
            let cardNum = input.value.replace(/-/g, '');
            // Sets the validity of the card number based on the number of digits in the card number
            isValid = cardNum.length === 16;
            // Displays the error message if the card number is invalid
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
            // Lets the user know that the card number must be 16 digits
            feedbackElement.innerHTML = 'Card number must be 16 digits.';
        }
        // Validate card expiration date
        if (input.dataset.validationType === 'card-exp') {
            // Get today's date as a date object
            const todaysDate = new Date();
            // Split the date entered into yyyy-mm
            let parts = dateStr.split('/');
            // Reorder the parts to 'YYYY-MM'
            let tempCard = `${parts[1]}-${parts[0]}`;
            // Convert the card expiration date to a date object
            const cardExp = new Date(tempCard);
            // Set the date to the first of the month
            cardExp.setDate(1);
            // Check to see if the card expiration date is in the past
            isValid = cardExp > todaysDate;
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
            // Lets the user know that the card expiration date must be in the future
            feedbackElement.innerHTML = 'Invalid card expiration date.';
        }
        // Validate card ccv
        if (input.dataset.validationType === 'card-ccv') {
            console.log('checking card');
            isValid = ccvRegex.test(input.value);
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
            feedbackElement.innerHTML = 'ccv must be 3-4 digits.';

        }
        // Validate amount 
        if (input.dataset.validationType === 'amount') {

            // if (isNaN(input.value)) {
            //     feedbackElement.innerHTML = 'Amount must be a number.';
            // }
            // Check for negative numbers
            isValid = input.value > 0;
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
            // Lets the user know that the amount must be a positive number
            feedbackElement.innerHTML = 'Amount must be a positive number.';

        }
        // Validate terms
        if (input.dataset.validationType === 'terms') {
            // Sets the validation of the terms based on the checkbox
            isValid = input.checked;
            // Displays a message if the checkbox is not checked
            feedbackElement.style.display = isValid ? 'none' : 'inline-block';
        }
        // Return the validity of the input field
        return isValid;
    }
});