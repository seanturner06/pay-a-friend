// Import Express dependency
const express = require('express');
// Import Multer dependency
const multer = require('multer');
// Create a new server instance
const app = express();
// Specify the folder to store any file upload
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
// Port number
const port = process.env.PORT || 3000;
// HTML files folder
const html_path = __dirname + '/templates/';
// Designate the static folder as serving static resources
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

// Route for filling out payment form
app.get('/', (req, res) => {
    res.sendFile(html_path + 'form.html');
});

// Route to submit payment form
app.post('/send', upload.single('file'), (req, res) => {
    console.log(req.file);
    if (req.file) {
        console.log('File uploaded successfully.');
    } else {
        console.log('File upload failed.');
    }
    console.log(req.body);
    // Store the request body in variables so validation can be performed
    const { senderFirstName, senderLastName, recipientFirstName, recipientLastName, message, notificationMethod, email, sms, card_num, card_exp, card_ccv, card_amount } = req.body;
    // Regex for email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regex for sms number
    const smsRegex = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
    // Sender's full name
    const senderFullName = senderFirstName + " " + senderLastName;
    // Recipient's full name
    const recipientFullName = recipientFirstName + " " + recipientLastName;
    // Restricted user variant 1
    const restrictedUserStuart = "Stuart Dent";
    // Restricted user variant 2
    const restrictedUserStu = "Stu Dent";

    try {
        // Check to make sure name the sender enter's their first name
        if (senderFirstName && senderFirstName.length === 0) {
            throw new Error("Sender first name is required.");
        }
        // Check to make sure name the sender enter's their last name
        if (senderLastName && senderLastName.length === 0) {
            throw new Error("Sender last name is required.");
        }
        // Check to make sure name the recipient enter's their first name
        if (recipientFirstName && recipientFirstName.length === 0) {
            throw new Error("Recipient first name is required.");
        }
        // Check to make sure name the recipient enter's their last name
        if (recipientLastName && recipientLastName.length === 0) {
            throw new Error("Recipient last name is required.");
        }
        // Check to see if recipient is a restricted user 
        if (recipientFullName.toLowerCase() === restrictedUserStuart.toLowerCase()
            || recipientFullName.toLowerCase() === restrictedUserStu.toLowerCase()) {
            throw new Error("Recipient is a Restricted User.");
        }
        // Check to see if sender is a restricted user
        if (senderFullName && restrictedUserStuart && senderFullName.toLowerCase() === restrictedUserStuart.toLowerCase() ||
            senderFullName && restrictedUserStu && senderFullName.toLowerCase() === restrictedUserStu.toLowerCase()) {
            throw new Error("Sender is a Restricted User.");
        }
        // Check to make sure the sender entered a message
        if (message === null) {
            throw new Error("Message is required.");
        }
        // Check to make sure the sender entered a long enough message
        if (message !== null && message.length < 10) {
            throw new Error("Message must be 10 characters.");
        }
        // Check to make sure the sender selected a notification method
        if (notificationMethod === null) {
            throw new Error("Notification method is required.");
        }
        // If the notification method is sms then a phone number must be entered
        if (notificationMethod === "SMS" && sms === null || notificationMethod === "SMS" && sms !== null && sms.length === 0) {
            throw new Error("Phone number is required if sms option is selected.");
        }
        // If the notification method is email then an email must be entered
        if (notificationMethod === "Email" && email === null || notificationMethod === "Email" && email !== null && email.length === 0) {
            throw new Error("Email is required is email option is selected.");
        }
        // If the notification method is email then check the format of the email
        if (notificationMethod === "Email" && !emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
        // If the notification method is sms then check the format of the phone number
        if (notificationMethod === "SMS" && !smsRegex.test(sms)) {
            throw new Error("Invalid phone number format.");
        }
        // If the notification method is ccv then check the format of the ccv
        if (card_ccv === null || card_ccv && card_ccv.length > 4 || card_ccv && card_ccv.length < 3) {
            console.log(card_ccv);
            throw new Error("Invalid ccv format.");
        }
        // Check the format of the card number
        if (card_num) {
            // Replace hyphens
            card_num = card_num.replace(/-/g, '');

            if (card_num.length !== 16) {
                throw new Error("Invalid card number format.");
            }
        }
        if (card_num === null || card_num === "") {
            throw new Error("Invalid card number.");
        }
        // Store today's date as a date object
        const todaysDate = new Date();
        // Convert the card expiration date to a date object
        const cardExp = new Date(card_exp);
        // Check to see if the card expiration date is in the past
        if (cardExp <= todaysDate) {
            throw new Error("Invalid card expiration date.");
        }
        // Check to make sure the card amount is a valid number
        if (card_amount && card_amount < 0 || card_amount === "") {
            throw new Error("Invalid card amount.");
        }
        // If all checks pass then send the user to the success page
        res.status(200).sendFile(html_path + 'success.html');
    } catch (err) {
        // If there is an error then send the user to the error page
        console.log(err);
        res.status(400).sendFile(html_path + 'error.html');
    }
});
app.listen(port, () => console.log('Server running on port: ' + '${port}'));