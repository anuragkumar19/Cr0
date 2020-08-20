// Getting Elements
const msgCont = document.getElementById('msgCont');
const showUser = document.getElementById('showUser');
const Msgform = document.getElementById('form');
const messageInput = document.getElementById('msg');
const logoP = document.querySelector('.logo');

let name = promptValidation();
showUser.innerText = `${name}`;

// Initialize socket.io
let socket = io('https://svmbthmnt.herokuapp.com/');

appendMessage({
  name: "Chatbot",
  message: {
    text: 'You joined the chat!',
    time: rTime()
  }
}, 'left');

socket.emit('new-user', name);


socket.on('chat-message', data => {
  appendMessage(data, 'left');
});

socket.on('user-connected', name => {
  appendMessage({
    name: 'Chatbot',
    message: {
      text: `${name} join the chat!`,
      time: rTime()
    }
  }, 'left');
});



socket.on('user-disconnected', name => {
  appendMessage({
    name: 'Chatbot',
    message: {
      text: `${name} left the chat!`,
      time: rTime()
    }
  }, 'left');
});


Msgform.addEventListener('submit', e=> {
  e.preventDefault();
  let messageText = messageInput.value;
  if (!messageText) {
    return;
  }
  messageText = messageText.trim();
  appendMessage({
    name: "You",
    message: {
      text: messageText,
      time: rTime()
    }
  }, 'right');
  socket.emit('send-chat-message', {
    time: rTime(),
    text: messageText
  });
  messageInput.value = '';
  messageInput.focus();
});

logoP.addEventListener('click', e=> {
  document.querySelector('html').requestFullscreen();
});


function promptValidation() {
  let Uname = prompt('What is you name?',
    '');
  if (Uname) {
    return Uname;
  } else {
    return promptValidation();
  }
}

function appendMessage(message, position) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  let messageHeader = document.createElement('div');
  messageHeader.classList.add('msg-header');
  messageHeader.innerHTML = `<span class="Username">${message.name}</span><span class="time">${message.message.time}</span>`;
  messageElement.appendChild(messageHeader);
  let para = document.createElement('p');
  para.innerText = message.message.text;
  messageElement.appendChild(para);
  msgCont.appendChild(messageElement);
  scrolldown();
}

function rTime () {
  let timeNew = new Date();
  return moment(timeNew).format('HH:mm a');
}

function scrolldown() {
  msgCont.scrollTop = msgCont.scrollHeight;
}