/*  
As long as the user is signed in, this function renders the mail/inbox.html template. 
The buttons along the top, then, need to selectively show and hide these views: the compose button, 
for example, should hide the emails-view and show the compose-view; the inbox button, 
meanwhile, should hide the compose-view and show the emails-view.
How do they do that? Notice at the bottom of inbox.html, the JavaScript file mail/inbox.js is included. 
Notice that when the DOM content of the page has been loaded, we attach event listeners to each of the buttons. 
When the inbox button is clicked, for example, we call the load_mailbox function with the argument 'inbox'; 
when the compose button is clicked, meanwhile, we call the compose_email function. 
What do these functions do? The compose_email function first hides the emails-view 
(by setting its style.display property to none) and shows the compose-view 
(by setting its style.display property to block). After that, the function takes all of the form input fields
(where the user might type in a recipient email address, subject line, and email body) 
and sets their value to the empty string '' to clear them out. 
This means that every time you click the “Compose” button, 
you should be presented with a blank email form: you can test this by typing values into form, 
switching the view to the Inbox, and then switching back to the Compose view.
Meanwhile, the load_mailbox function first shows the emails-view and hides the compose-view. 
The load_mailbox function also takes an argument, 
which will be the name of the mailbox that the user is trying to view (Inbox, Sent or Archive). 
For this project, you’ll design an email client with three mailboxes: an 'inbox', a 'sent' mailbox of all sent mail, 
and an 'archive' of emails that were once in the inbox but have since been archived. 
The argument to load_mailbox, then, will be one of those three values, 
and the load_mailbox function displays the name of the selected mailbox by updating the innerHTML 
of the emails-view (after capitalizing the first character). 
This is why, when you choose a mailbox name in the browser, 
you see the name of that mailbox (capitalized) appear in the DOM: the load_mailbox function is updating 
the emails-view to include the appropriate text.

API
You’ll get mail, send mail, and update emails by using this application’s API in the JavaScript code. 
This application supports the following API routes:

--- GET /emails/<str:mailbox>
Sending a GET request to /emails/<mailbox> where <mailbox> is either inbox, sent, or archive will return back to you
(in JSON form) a list of all emails in that mailbox, in reverse chronological order. 
For example, if you send a GET request to /emails/inbox, you might get a JSON response like the below 
(representing two emails):

[
    {
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
    },
    {
        "id": 95,
        "sender": "baz@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Meeting Tomorrow",
        "body": "What time are we meeting?",
        "timestamp": "Jan 1 2020, 12:00 AM",
        "read": true,
        "archived": false
    }
]
Notice that each email specifies its id (a unique identifier), a sender email address, an array of recipients, 
a string for subject, body, and timestamp, 
as well as two boolean values indicating whether the email has been read and whether the email has been archived.

How would you get access to such values in JavaScript? Recall that in JavaScript, 
you can use fetch to make a web request. Therefore, the following JavaScript code

fetch('/emails/inbox')
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
});
would make a GET request to /emails/inbox, convert the resulting response into JSON, 
and then provide to you the array of emails inside of the variable emails. 
You can print that value out to the browser’s console using console.log 
(if you don’t have any emails in your inbox, this will be an empty array), or do something else with that array.

Note also that if you request an invalid mailbox (anything other than inbox, sent, or archive), 
you’ll instead get back the JSON response {"error": "Invalid mailbox."}.

--- GET /emails/<int:email_id>
Sending a GET request to /emails/email_id where email_id is an integer id for an email 
will return a JSON representation of the email, like the below:

{
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
}
Note that if the email doesn’t exist, or if the user does not have access to the email, 
the route instead return a 404 Not Found error with a JSON response of {"error": "Email not found."}.

To get email number 100, for example, you might write JavaScript code like

fetch('/emails/100')
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...
});

-- POST /emails
So far, we’ve seen how to get emails: either all of the emails in a mailbox, or just a single email.
To send an email, you can send a POST request to the /emails route. 
The route requires three pieces of data to be submitted: 
a recipients value (a comma-separated string of all users to send an email to), 
a subject string, and a body string. For example, you could write JavaScript code like

fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: 'baz@example.com',
      subject: 'Meeting time',
      body: 'How about we meet tomorrow at 3pm?'
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
});
If the email is sent successfully, the route will respond with a 201 status code and a JSON response 
of {"message": "Email sent successfully."}.

Note that there must be at least one email recipient: if one isn’t provided, the route will instead respond 
with a 400 status code and a JSON response of {"error": "At least one recipient required."}. 
All recipients must also be valid users who have registered on this particular web application: 
if you try to send an email to baz@example.com but there is no user with that email address, 
you’ll get a JSON response of {"error": "User with email baz@example.com does not exist."}.

-- PUT /emails/<int:email_id>
The final route that you’ll need is the ability to mark an email as read/unread or as archived/unarchived. 
To do so, send a PUT request (instead of a GET) request to /emails/<email_id> 
where email_id is the id of the email you’re trying to modify. For example, JavaScript code like

fetch('/emails/100', {
  method: 'PUT',
  body: JSON.stringify({
      archived: true
  })
})
would mark email number 100 as archived. The body of the PUT request could also be {archived: false} 
to unarchive the message, and likewise could be either {read: true} or read: false}
to mark the email as read or unread, respectively.

Using these four API routes (getting all emails in a mailbox, getting a single email, 
sending an email, and updating an existing email), 
are the tools to complete this project.

Specification
Using JavaScript, HTML, and CSS, complete the implementation of this single-page-app email client 
inside of inbox.js (and not additional or other files; 
*/

/* Use buttons to toggle between views. 
  When the DOM content of the page has been loaded, we attach event listeners to each of the buttons */
document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archive').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;
  // By default, load the inbox mailbox
  load_mailbox('inbox');
});



/* Show compose view and hide other views. The compose_email function first hides the emails-view 
  (by setting its style.display property to none) and shows the compose-view 
  (by setting its style.display property to block). */
function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelectorAll("button").forEach(button => button.classList.remove("selected"));
  document.querySelector(`#compose`).classList.add("selected");

  /*After that, Clear out composition fields. The function takes all of the form input fields 
  (where the user might type in a recipient email address, subject line, and email body) 
  and sets their value to the empty string '' to clear them out. 
  This means that every time you click the “Compose” button, you should be presented with a blank email form */
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

/* Requirement:
    Send Mail: When a user submits the email composition form, here is the JavaScript code to actually send the email.
    Make a POST request to /emails, passing in values for recipients, subject, and body.
    Once the email has been sent, load the user’s sent mailbox.*/
function send_email() {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    console.log(recipients);
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
      .then(response => response.json())
        .then(result => {
          if ("message" in result) {
              load_mailbox('sent');  // Once the email has been sent, load the user’s sent mailbox. 
          }
  
          if ("error" in result) {
              document.querySelector('#to-text-error-message').innerHTML = result['error']
  
          } // If error sending the mail, show the error text message (Note that there must be at least one email recipient: if one isn’t provided, the route will instead respond with a 400 status code and a JSON response of {"error": "At least one recipient required."}. All recipients must also be valid users who have registered on this particular web application)
          console.log(result);
          console.log("message" in result);
          console.log("error" in result);
        })
          .catch(error => {
              console.log(error);
          });
    return false;
  }



/* Mailbox: 
The load_mailbox function first shows the emails-view and hides the compose-view. 
The load_mailbox function also takes an argument, which will be the name of the mailbox that the user is trying to view. 
For this project, you’ll design an email client with three mailboxes: an inbox, a sent mailbox of all sent mail, 
and an archive of emails that were once in the inbox but have since been archived. 
The argument to load_mailbox, then, will be one of those three values, 
and the load_mailbox function displays the name of the selected mailbox by updating the innerHTML of the emails-view 
(after capitalizing the first character). This is why, when you choose a mailbox name in the browser, 
you see the name of that mailbox (capitalized) appear in the DOM: the load_mailbox function is updating the 
emails-view to include the appropriate text.
When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, 
what the subject line is, and the timestamp of the email.
If the email is unread, it should appear with a white background. 
If the email has been read, it should appear with a gray background. */
function load_mailbox(mailbox) {
  
   // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#single-email-view').style.display = 'none';
    document.querySelectorAll("button").forEach(button => button.classList.remove("selected"));
    document.querySelector(`#${mailbox}`).classList.add("selected");
  
     // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    // Headers "Sender", "Subject", "Timestamp/Date and Time"
    const header_row = document.createElement('div');
    header_row.classList.add("row", "email-line-box", "header-row");
  
    const headers = [
      { name: 'Sender', size: 5 },
      { name: 'Subject', size: 3 },
      { name: 'Timestamp', size: 4 }
    ];
  
    headers.forEach(header => {
      const header_div = document.createElement('div');
      header_div.classList.add(`col-${header.size}`, "header-section");
      header_div.innerHTML = `<strong>${header.name}</strong>`;
      header_row.append(header_div);
    });
  
    document.querySelector('#emails-view').append(header_row);
  
  /* Make a GET request to /emails/<mailbox> to request the emails for a particular mailbox.
When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
When a mailbox is visited, the name of the mailbox should appear at the top of the page. */
  // Update the mailbox with the latest emails to show for this mailbox.
    fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
          const sections_to_show = [['sender', 5], ['subject', 3], ['timestamp', 4]];
  
          emails.forEach(email => {
              const row_div_element = document.createElement('div');
              row_div_element.classList.add("row","email-line-box", email["read"] ? "read" : "unread");
  
              sections_to_show.forEach(
                  section => {
                      const section_name = section[0];
                      const section_size = section[1];
                      const div_section = document.createElement('div');
                      div_section.classList.add(`col-${section_size}`, `${section_name}-section`);
                      div_section.innerHTML = `<p>${email[section_name]}</p>`;
                      row_div_element.append(div_section);
                  }
              );
  
              // EventListener to show mail on click
              row_div_element.addEventListener('click', () => load_email(email["id"], mailbox));
  
              document.querySelector('#emails-view').append(row_div_element);
          });
  
      })
      .catch(error => console.log(error)); // print log in case of error
  }
  


/* View Email: 
When a user clicks on an email, the user should be taken to a view where they see the content of that email.
Should make a GET request to /emails/<email_id> to request the email.
The application should show the email’s sender, recipients, subject, timestamp, and body.
Should add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. 
Hide and show the right views when navigation options are clicked.
Add an event listener to an HTML element added to the DOM.
Once the email has been clicked on, should mark the email as read. 
Can send a PUT request to /emails/<email_id> to update whether an email is read or not. */

function load_email(email_id, origin_mailbox) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#single-email-view').style.display = 'block';

    document.querySelector('#single-email-content').innerHTML= '';
    document.querySelector('#single-email-back-section').innerHTML = '';

    fetch(`/emails/${email_id}`)
        .then(response => response.json())
        .then(email => {
            if ("error" in email) {console.log(email)}
            ["subject", "timestamp", "sender", "recipients", "body"].forEach(email_element => {
                const div_row = document.createElement('div');
                div_row.classList.add("row", `email-${email_element}-section`);
                if (email_element === "subject") {
                    // Subject section + div element for buttons on the right ('archive' and 'reply')
                    const div_col_subject = document.createElement('div');
                    div_col_subject.classList.add("col-8");
                    div_col_subject.id = "email-subject-subsection";
                    div_col_subject.innerHTML  = `<p>${email[email_element]}</p>`;
                    div_row.append(div_col_subject);

                    // div element for buttons on the right side ('archive' and 'reply')
                    const div_col_reply_archive = document.createElement('div');
                    div_col_reply_archive.classList.add("col-4");
                    div_col_reply_archive.id="archive-reply-button";
                    const data_for_potential_buttons_to_add = [
                        ["Reply", () => reply_email(email)], // 'Reply' button
                        [email["archived"] ? "Unarchive" : "Archive",
                            () => archive_email(email_id, !email["archived"] )] // 'Archive' button
                    ];

                    // If mailbox is "Sent", don't need 'archive' button
                    (origin_mailbox === "sent" ?
                        data_for_potential_buttons_to_add.slice(0,1) : data_for_potential_buttons_to_add)
                    .forEach( text_function => {
                        const text = text_function[0];
                        const callback_func = text_function[1];
                        const button = document.createElement("button");
                        button.classList.add("float-right");
                        button.innerHTML = text;
                        button.addEventListener('click', callback_func);
                        div_col_reply_archive.append(button);
                    });
                    div_row.append(div_col_reply_archive);

                }
                else {
                    div_row.innerHTML = `<p>${email[email_element]}</p>`;
                }

                document.querySelector("#single-email-content").append(div_row);
            });
            const back_button_row_div = document.createElement('div');
            back_button_row_div.classList.add("row");
            const back_button_col_div = document.createElement('div');
            back_button_col_div.classList.add("col-2", "offset-5");
            back_button_col_div.id = "back-button";
            back_button_col_div.innerHTML =
                `<p>${origin_mailbox.charAt(0).toUpperCase() + origin_mailbox.slice(1)}</p>`;
            back_button_col_div.addEventListener('click', () => load_mailbox(origin_mailbox));
            back_button_row_div.append(back_button_col_div);
            document.querySelector("#single-email-back-section").append(back_button_row_div);


        })
        .catch(error =>console.log(error));

    // PUT 'read: true'
    fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
    }).then();
}

/* Archive and Unarchive: 
Allow users to archive and unarchive emails that they have received.
When viewing an Inbox email, the user should be presented with a button that lets them archive the email. 
When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. 
This requirement does not apply to emails in the Sent mailbox.
Can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.
Once an email has been archived or unarchived, load the user’s inbox. */

function archive_email(email_id, to_archive) {
    fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: to_archive 
        })
    }).then( () => load_mailbox("inbox"));

}


/* Reply: 
Allow users to reply to an email.
When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
When the user clicks the “Reply” button, they should be taken to the email composition form. */

function reply_email(email) {
    compose_email();

    // Pre-fill the composition form with the recipient field set to whoever sent the original email.
    document.querySelector('#compose-recipients').value = email["sender"];

    /* Pre-fill the subject line. If the original email had a subject line of 'foo', 
    the new subject line should be 'Re:foo'.
    (If the subject line already begins with Re: , no need to add it again.) */
    const original_subject = email["subject"];
    document.querySelector('#compose-subject').value = 
        original_subject.startsWith("Re: ") ? original_subject : `Re: ${original_subject}`;

    /* Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" 
    followed by the original text of the email.*/
    const reply_header = `\n\n\n------ On ${email['timestamp']}, ${email["sender"]} wrote:\n\n`;
    const original_body = email["body"].replace(/^/gm, "\t"); // indent original rows
    document.querySelector('#compose-body').value = reply_header + original_body;
}


