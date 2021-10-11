var express = require('express');
var app = express();
var server = require('http').Server(app);


var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

//Usando middleware de express para especificarle que cargue PRIMERO la carpeta "client" con el archivo "index.html"
// app.use(express.static('client'));

const port = process.env.PORT || 3000;

//Esta ruta esta en este archivo para probar que funciona el servidor. DEBE ESTAR EN OTRO (APP.JS xejemplo)
app.get('/', (req, res) => {
    res.send("<h1>Working</h1>");
});

var messages = [{
    id: 1,
    text: 'Bienvenido al chat privado de Socket.io y NodeJs de Carlos Rodas, ¿En que puedo ayudarte?',
    nickname: 'Bot-carlos'
}];


//Abriendo conexion al socket, metodo encargado de recibir las conexiones de los clientes
io.on('connection', function (socket) {
    console.log(`El cliente con IP ${socket.handshake.headers.host} se ha conectado`);

    //Emitiendo mensaje al cliente
    socket.emit('messages', messages);

    //Recibiendo mensaje del cliente
    socket.on('add-message', function (data) {
        //Añadiendo el mensaje en el array persistiendo mientras el servidor esta corriendo
        messages.push(data);

        //Emitiendo a todos los clientes conectados el mensaje actualizado
        io.sockets.emit('messages', messages);

        // socket.broadcast.emit('messages', messages);
    });
});

//Creando servidor con Express que ademas tiene http incluido ya
server.listen(port, () => { //Servidor escuchando
    console.log(`Servidor funcionando en ${port}`);
});