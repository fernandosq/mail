document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    //bind send email button
    document.querySelector('#send').addEventListener('click', send_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#inbox-name').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  get_email(mailbox);
}

function get_email(mailbox) {
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(
        emails => {
            document.querySelector("#emails-list").innerHTML = document.createElement("DIV").innerHTML;
            console.log(emails);
            emails.forEach( email => {
                let new_elem = document.createElement("DIV");
                new_elem.id = `mail-${email.id}`
                new_elem.style.background = email.read? "lightblue" : "white";
                 // Para cambiar boton de archivar o desarchivar
               if (email.archived){
                   new_elem.innerHTML = `
                       <button id=desarchive-${email.id}>Desarchive</button>
                       <a onclick="email(${email.id})"> Email: ${email["body"]},${email["sender"]},${email["timestamp"]} </a>`
                   document.querySelector("#emails-list").appendChild(new_elem);
                   document.querySelector(`#desarchive-${email.id}`).addEventListener('click', () => desarchived(email.id));
               } else {
                   new_elem.innerHTML = `
                        <button id=archive-${email.id}>Archive</button>
                        <a onclick="email(${email.id})"> Email: ${email["body"]},${email["sender"]},${email["timestamp"]} </a>`;
                   document.querySelector("#emails-list").appendChild(new_elem);
                   document.querySelector(`#archive-${email.id}`).addEventListener('click', () => archived(email.id));
               }
            });
        }
    ).catch(e => console.log(e.toString()))
}

function send_email() {
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    }).then(response => alert(response));
}

function archived(email_id){
    fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
    });
    load_mailbox('archive')
}
function desarchived(email_id){
  fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
        archived: false
    })
  });
  load_mailbox('inbox')
}
function read(email_id){
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function email(email_id)

{
  read(email_id);
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  fetch(`/emails/${email_id}`, {
  })
  .then(response => response.json())
  .then(email => {
      document.querySelector('#from').innerHTML=`From: ${email.sender}`;
      document.querySelector('#to').innerHTML=`To: ${email.recipients}`;
      document.querySelector('#subject').innerHTML=`Subject: ${email.subject}`;
      document.querySelector('#timestamp').innerHTML=`Timestamp: ${email.timestamp}`;
      document.querySelector('#body').innerHTML=`${email.body}`;
      document.querySelector(`#reply`).addEventListener('click', () => reply(email.id));
  })
}










function reply(email_id){
    // Show compose view and hide other views

  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields

     fetch(`/emails/${email_id}`, {
  })
  .then(response => response.json())
  .then(email => {
      document.querySelector('#compose-recipients').value = `${email.sender}`;
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
      document.querySelector('#compose-body').value = `${email.timestamp}, ${email.sender},wrote: ${email.body}`;
  })
}