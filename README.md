# streamy: Directly use Meteor streams with a friendly API

  > **Fork of [ferjep:streamy](https://github.com/ferjep/streamy)** — modernized for Meteor 3.0, with `underscore` removed and native JS throughout.

## Installation

```console
meteor add a4xrbj1:streamy
```

Or via npm (GitHub Packages):

```console
npm install @a4xrbj1/streamy --registry=https://npm.pkg.github.com
```

**Note**: Meteor keeps logging warnings with `_debug` about messages not being recognized. You can override `Meteor._debug` to suppress these warnings (as shown in the example).

## Basic Usage

```javascript
// Attach an handler for a specific message
Streamy.on('hello', function(d, s) {
  console.log(d.data); // Will print 'world!'

  // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
});

// Send a message
// from client to server
Streamy.emit('hello', { data: 'world!' });

// from server to client, you need an instance of the client socket (retrieved inside an 'on' callback or via `Streamy.sockets(sid)`)
Streamy.emit('hello', { data: 'world!' }, s);
```

## Core

### Streamy.emit(message_name, data_object, [socket])

Send a message with associated data to a socket. On the client, you do not need to provide the socket arg since it will use the client socket. On the server, **you must provide it**.

### Streamy.on(message_name, callback)

Register a callback for a specific message. The callback will be called when a message of this type has been received. Callback are of the form:

```javascript
// Client
Streamy.on('my_message', function(data) {
  console.log(data);
});

// Server
Streamy.on('my_message', function(data, from) {
  // from is a Socket object
  Streamy.emit('pong', {}, from); // An example of replying to a message
});
```

### Streamy.off(message_name)

Un-register handler of a specific message.

### Streamy.onConnect(callback) / Streamy.onDisconnect(callback)

Register callbacks to be called upon connection, disconnection. Please note that this is tied to the websockets only and has nothing to do with authentification.

The callback is parameterless on client. On the server, it will contains one parameter, the socket which has been connected/disconnected.

## Multiple servers support

Streamy comes with support for communication between multiple Meteor servers. When your app needs to connect to another Meteor server, if that server uses Streamy then communication by messages can be done easily just like between your server and client.

### Streamy.Connection(connection)

This is a constructor to create a Streamy connection. It requires one variable which is the connection to another Meteor server. This connection is the returned value when you connect to other Meteor server by [`DDP.connect`](https://docs.meteor.com/api/connections.html#DDP-connect). Instances of this constructor will be able to use these methods: `.on`, `.emit`, `.off`, `.onConnect`, `.onDisconnect`. They have the same effect with method having the same name of the `Streamy` object. Example:

```javascript
var connection = DDP.connect('localhost:4000');

var streamyConnection = new Streamy.Connection(connection);

// call when connect to localhost:4000 success
streamyConnection.onConnect(function() {
  console.log('Connected to localhost:4000');

  // send a message to localhost:4000
  streamyConnection.emit('hello', {
    data: 'world',
  });
});

// listen for message from localhost:4000
streamyConnection.on('data', function(data) {
  // ...
});

streamyConnection.onDisconnect(function() {
  console.log('Disconnected from localhost:4000');
});
```

### Streamy.Connection.prototype.on(message_name, callback)

Same as [Streamy.on](#streamyonmessage_name-callback)

### Streamy.Connection.prototype.off(message_name)

Same as [Streamy.off](#streamyoffmessage_name)

### Streamy.Connection.prototype.onConnect(callback) / Streamy.Connection.prototype.onDisconnect(callback)

Same as [Streamy.onConnect/Streamy.onDisconnect](#streamyonconnectcallback--streamyondisconnectcallback)

## Utilities

### Streamy.sockets([sid]) Server-only

If no parameter is given, returns all connected socket objects. If a string or an array of strings is provided it will returns a special object with a `send` method and matched sockets in `_sockets`.

### Streamy.id([socket])

Retrieve the connection id. A unique identifier for each connections. On the server, you should provide the socket object to retrieve the associated connection id.
