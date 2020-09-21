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
                 // Para cambiar boton de archivar o desarchivar

               // if (email.archived === true){
                 //   new_elem.innerHTML = `
                  //      <button id=desarchive-${email.id}>Desarchive</button>
                   //     <a href="emails/${email.id}"> Email: ${email["body"]},${email["sender"]},${email["timestamp"]} </a>`
               // } else {
                    new_elem.innerHTML = `
                        <button id=archive-${email.id}>Archive</button>
                        <a href="emails/${email.id}"> Email: ${email["body"]},${email["sender"]},${email["timestamp"]} </a>`;
                //}

                document.querySelector("#emails-list").appendChild(new_elem);
                // Para poner el email como leido al pinchar en enlace
                // document.querySelector(`#email`).addEventListener('click', () => read(email.id));
                // if(email.read == true){}
                // funciones de archivar o desarchivar al pulsar boton
                document.querySelector(`#archive-${email.id}`).addEventListener('click', () => archived(email.id));
               // document.querySelector(`#desarchive-${email.id}`).addEventListener('click', () => desarchived(email.id));

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
  })
}
function desarchived(email_id){
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
}
function read(email_id){
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
}