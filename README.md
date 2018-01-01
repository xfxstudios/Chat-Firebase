# Chat-Firebase
Chat simple escrito en html y js con interacción a través de Firebase.

## [DEMO](https://hitcel.com/chat/#) ##


![picture alt](https://image.ibb.co/iH76pw/chat.png "Ventana de Chat")


* Primero debe crearse una cuenta o un proyecto en la [Consola de Firebase](https://console.firebase.google.com/u/1/)

* Luego debe configurar el archivo `js/index.js`

Reemplazan estos datos por los proporsionador por firebase al momento de crear su proyecto
```javascript
    var config = {
        apiKey: "APIKEY",
        authDomain: "AUTHDOMAIN",
        databaseURL: "DATABASE URL",
        projectId: "PROJECT ID",
        storageBucket: "STORAGE",
        messagingSenderId: "SENDER ID"
    };
  ```

  Si desean cambiar el nodo del chat solo deben ir a la linea:
  `169 de index.js`
  y reemplazar donde dice __Chat__

  > database.ref('Chat/' + timeJs().time).set({

y en la linea `188` para la escucha

> var lista = firebase.database().ref('Chat/').limitToLast(30);

El chat permite:

* Conectarse a través de Google
* Pueden configurar el Login de Facebook
* Insertar mensajes con su Avatar Social

De igual maneran pueden aprender a utilizar los metodos e implementar otros nuevos para sus prácticas como:

* Creación de Canales de Chat
* Agregar imagenes al chat a través de Storage Firebase
* Crear canales de chat 1 a 1 entre usuarios
* Mostrar listas de Usuarios Conectados al Chat

