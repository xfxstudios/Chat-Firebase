//Datos de Conexion a Firebase
var config = {
    apiKey: "AIzaSyBqjAwBJtUOS8Rg_TTJESIX6hdYVp3Fg-U",
    authDomain: "pruebashitcel.firebaseapp.com",
    databaseURL: "https://pruebashitcel.firebaseio.com",
    projectId: "pruebashitcel",
    storageBucket: "pruebashitcel.appspot.com",
    messagingSenderId: "755242969407"
  };
  //Inicializador de Firebase
  firebase.initializeApp(config);

  //Inicializadores de Login Sociales
  var facebook = new firebase.auth.FacebookAuthProvider();
  var gmail    = new firebase.auth.GoogleAuthProvider();

  //Variable de Auth de Firebase
  var authService = firebase.auth();
  //Variable de Database de Firebase
  var database = firebase.database();
  //Nodo de la Base de datos a leer o escribir
  var tempRef = database.ref("Chat");

  //Funcion retorna la fecha en varios formatos
  function timeJs() {
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var tomahora = new Date();
    var hora = tomahora.getHours()+":"+tomahora.getMinutes()+":"+tomahora.getSeconds();
    var dTime = tomahora.getFullYear()+'-'+tomahora.getMonth()+'-'+tomahora.getDate()+'T'+tomahora.getHours()+":"+tomahora.getMinutes()+":"+tomahora.getSeconds();

    var retorno = {
        time:timestamp,
        hour:hora,
        datetime:dTime
    }
    return retorno;
}

//Mensaje de entrada en lista de Mensajes de Chat
$("#listaMensajes").append('<li>Debe Logearse para ver los Mensajes</li>');


//Observamos el evento click en el boton de login de facebook
document.getElementById('loginfacebook').addEventListener('click', function() {
    // autentico con Facebook
    /*authService.signInWithPopup(facebook)
        .then(function(result) {
            //todo correcto
            var usuario = result.additionalUserInfo.profile;
            var fc = result.credential;

            localStorage.setItem('nombre',usuario.name);
            localStorage.setItem('nameSocial',usuario.name);
            localStorage.setItem('email',usuario.email);
            localStorage.setItem('emailSocial',usuario.email);
            localStorage.setItem('foto',usuario.picture.data.url);
            $("#cuadroEntrada").slideUp('slow');
            $("#cuadroSalida").slideDown('slow');

        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log('Detectado un error:', error);

            switch(errorCode){
                case 'auth/account-exists-with-different-credential':
                    toastr.error(trad.fireFacebookError);
                    return false;
                break;
            }
    });*/
    alert("No Disponible");
});


//LOGIN CON GMAIL
//Observamos el evento de login en el boton de google
document.getElementById('logingmail').addEventListener('click', function() {
    //Ejecutamos al login en google con la cuenta gmail
    firebase.auth().signInWithPopup(gmail).then(function(result) {

            //Si el login es correcto procedemos a leer la informacion entrante
            var token = result.credential.accessToken;
            var user = result.user;
            var usuario = result.additionalUserInfo.profile;
            var credencial = result.credential;

            //Preparamos las variables a utilizar durante el chat
            localStorage.setItem('nombre',usuario.name);
            localStorage.setItem('nameSocial',usuario.name);
            localStorage.setItem('email',usuario.email);
            localStorage.setItem('emailSocial',usuario.email);
            localStorage.setItem('foto',usuario.picture);
            //Oculto los botones de login y muestro el de salida
            $("#cuadroEntrada").slideUp('slow');
            $("#cuadroSalida").slideDown('slow');
            $("#listaMensajes").html("");

      // ...
      //En caso de error los gestionamos de acuerdo a la respuesta de firebase auth
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      // ...
      console.log(errorCode);
      switch(errorCode){
          case 'auth/network-request-failed':
              alert("Sin conexion a Internet");
              return false;
          break;
          
          case 'auth/popup-closed-by-user':
                alert("Ventana cerrada por el Usuario");
              return false;
          break;

        case 'auth/internal-error':
            alert("Error interno de Firebase");
          return false;
        break;
      }
    });
});
//END LOGIN CON GMAIL

//Detectamos el evento salir en el boton correspondiente
document.getElementById('salir').addEventListener('click', function(){

    //Ejuecutamos la salida mediante firebase auth
    firebase.auth().signOut().then(function() {
        //limpio las variables de uso
        localStorage.setItem('nombre','');
        localStorage.setItem('nameSocial','');
        localStorage.setItem('email','');
        localStorage.setItem('emailSocial','');
        localStorage.setItem('foto','');
        //Intercambio los botones
        $("#cuadroSalida").slideUp('slow');
        $("#listaMensajes").html("");
        //Muestro el mensaje de control
        $("#listaMensajes").append('<li>Debe Logearse para ver los Mensajes</li>');
    
    }, function(error) {

    console.log(error);

    })
})


$(function(){
    //Monitoreamos el estado de la conexion a firebase (Si el usuario esta conectado o no)
    firebase.auth().onAuthStateChanged(function(user) {
        //Si esta conectado
        if (user) {
            //Intercambiamos los botones
            $("#cuadroEntrada").slideUp('slow');
            $("#cuadroSalida").slideDown('slow');
                //Iniciamos el evento de escucha al boton enviar m,ensaje
                document.getElementById('btnSend').addEventListener('click', function(){
                    //Si el campo no esta vacio
                    if($("#exampleInputAmount").val() != ""){
                        //Registro en firebase data base el mensaje
                        database.ref('Chat/' + timeJs().time).set({
                            usuario: localStorage.getItem('email'),
                            nombre: localStorage.getItem('nombre'),
                            fecha: timeJs().datetime,
                            foto: localStorage.getItem('foto'),
                            mensaje:$("#exampleInputAmount").val()
                        });
                        //Limpio el campo
                        $("#exampleInputAmount").val("");
                        return false;
                    }else{
                        //En caso de estar vacio elc ampo
                        alert("Debe escribir un mensaje a enviar");
                        return false;
                    }
                })
                
                //Inicio el evento de escucha del nodo Chat para detectar nuevos mensajes y mostrarlos en la linea de tiempo
                //Muestro los ultimos 30 mensajes del chat
                var lista = firebase.database().ref('Chat/').limitToLast(30);
                lista.on('child_added', function(data) {
                    //plantilla para mostrar el mensaje
                    var tpl = `<li style="width:100%">
                                <div class="msj macro">
                                <div class="avatar"><img class="img-circle" style="width:100%;" src="`+data.val().foto+`" /></div>
                                    <div class="text text-l">
                                        <p>`+data.val().mensaje+`</p>
                                        <p><small>`+data.val().fecha+`</small></p>
                                    </div>
                                </div>
                            </li>`;
                    //Agrego el mensaje a la lista
                    $("#listaMensajes").append(tpl);
                    //Hago scroll hacia el ultimo item de la lista automaticamente
                    var d = $('#contenedorMensajes');
                    d.scrollTop(d.prop("scrollHeight"));
                });

        } else {
            //En caso de no estar logueado o vencida la secion intercambio los botones
            $("#cuadroSalida").slideUp('slow');
            $("#cuadroEntrada").slideDown('slow');
        }
    });
})