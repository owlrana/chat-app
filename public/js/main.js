const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// checking if we getting username and room from URL or not
//console.log(username, room);


const socket = io();

// join chat room 
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    //console.log(message);

    // we want to output this message to the chat area
    outputMessage(message);

    // scroll down everytime we get a new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    // when you submit a form it automatically submits to a form, we want to prevent that
    e.preventDefault();

    // we want to get the text element, we can grab it from the DOM as well
    const msg = e.target.elements.msg.value;

    // logs this message on the client-side
    //console.log(msg);

    // Emit a message to the server
    socket.emit('chatMessage', msg);

    // clear input after submitted to chat
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to the DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;

}

// add users to DOM
function outputUsers (users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}