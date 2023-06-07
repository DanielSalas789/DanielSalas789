// Referencias a los elementos del DOM
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Inicializar Firebase Firestore
const firestore = firebase.firestore();

// Configurar referencia a la colección de mensajes
const messagesRef = firestore.collection('messages');

// Escuchar eventos del botón de enviar
sendButton.addEventListener('click', () => {
  const messageContent = messageInput.value;
  const timestamp = new Date();

  // Obtener el usuario actualmente autenticado (opcional)
  const user = firebase.auth().currentUser;
  const userId = user ? user.uid : 'anonymous';
  const username = user ? user.displayName : 'Anónimo';

  // Crear un objeto de mensaje con la información relevante
  const message = {
    userId: userId,
    username: username,
    content: messageContent,
    timestamp: timestamp
  };

  // Guardar el mensaje en Firebase Firestore
  messagesRef.add(message)
    .then(() => {
      // Limpiar el campo de entrada después de enviar el mensaje
      messageInput.value = '';
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error);
    });
});

// Escuchar cambios en la colección de mensajes
messagesRef.orderBy('timestamp', 'asc').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const message = change.doc.data();
      displayMessage(message);
    }
  });
});

// Función para mostrar un mensaje en el contenedor de mensajes
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.username}: ${message.content}`;
  messageContainer.appendChild(messageElement);
}
