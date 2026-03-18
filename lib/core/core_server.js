let sessions = {};

// -------------------------------------------------------------------------- //
// ------------------------------- Accessors -------------------------------- //
// -------------------------------------------------------------------------- //

/**
 * Contains reactive variables for each connection id/user id
 * @type {Object}
 */
Streamy._usersId = {};

/**
 * Retrieve server connected sockets or a subset
 * @param {String|Array} sid Optional, socket id or ids to retrieve
 * @return  {Object} If sid is provided, it will returns an object with a send method and _sockets array of sockets, else, it will returns all sockets
 */
Streamy.sockets = function(sid) {

  if(sid) {
    sid = Array.isArray(sid) ? sid : [sid];
    const sockets = [];

    sid.forEach(function(session_id) {
      const sock = sessions[session_id];

      if(sock)
        sockets.push(sock);
    });

    return {
      _sockets: sockets,
      send: function(data) {
        sockets.forEach(function(socket) {
          socket.send(data);
        });
      }
    }
  }

  return sessions;
};

/**
 * Retrieve server connected sockets or a subset
 * @param {String|Array} uid Optional, user id or ids to retrieve
 * @return  {Object} If uid is provided, it will returns an object with a send method and _sockets array of sockets, else, it will returns all sockets
 */
Streamy.socketsForUsers = function(uid) {

  if(uid) {
    uid = Array.isArray(uid) ? uid : [uid];

    const sockets = Object.values(Streamy.sockets()).filter(function(socket) {
      return socket._meteorSession && uid.indexOf(socket._meteorSession.userId) !== -1;
    });

    return {
      _sockets: sockets,
      send: function(data) {
        sockets.forEach(function(socket) {
          socket.send(data);
        });
      }
    }
  }

  return sessions;

};

// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = function() {
  const self = this;

  // If accounts package is installed, register for successful login attempts
  if(typeof(Accounts) !== 'undefined' ) {
    Accounts.onLogin(function onLoggedIn(data) {
      Streamy._usersId[data.connection.id].set(data.user._id);
    });
  }

  // When a new connection has been received
  Meteor.server.stream_server.register(function onNewConnected(socket) {
    let handlers_registered = false;

    // On closed, call disconnect handlers
    socket.on('close', function onSocketClosed() {
      if(handlers_registered) {
        const sid = Streamy.id(socket);

        delete sessions[sid];
        delete Streamy._usersId[sid];

        self.disconnectHandlers().forEach(function forEachDisconnectHandler(cb) {
          cb.call(self, socket);
        });
      }
    });

    // This little trick is used to register protocol handlers on the
    // socket._meteorSession object, so we need it to be set
    socket.on('data', function onSocketData(raw_data) {

      // Since we doesn't have a Accounts.onLogout callback, we must use this little trick, will be replaced when a proper callback is added
      if(JSON.parse(raw_data).method === 'logout' && socket.__sid) {
        Streamy._usersId[Streamy.id(socket)].set(null);
      }

      // Only if the socket as a meteor session
      if(!handlers_registered && socket._meteorSession) {

        // Store the meteorSesion id in an inner property since _meteorSession will be deleted upon socket closed
        socket.__sid = socket._meteorSession.id;

        const sid = Streamy.id(socket);

        handlers_registered = true;

        sessions[sid] = socket;
        Streamy._usersId[sid] = new ReactiveVar(null);

        // Call connection handlers
        self.connectHandlers().forEach(function forEachConnectHandler(cb) {
          cb.call(self, socket);
        });

        // Add each handler to the list of protocol handlers
        Object.entries(self.handlers()).forEach(function forEachHandler([name, cb]) {
          if(!socket._meteorSession.protocol_handlers[name]) {
            socket._meteorSession.protocol_handlers[name] = function onMessage(raw_msg) {
              delete raw_msg.msg; // Remove msg field
              cb.call(self, raw_msg, this.socket);
            };
          }
        });
      }
    });
  });
};

Streamy._write = function(data, to) {
  if(to)
    to.send(data);
};
