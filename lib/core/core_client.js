// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = function() {

  const self = this;

  // Uppon close
  Meteor.connection._stream.on('disconnect', function onClose() {
    // If it was previously connected, call disconnect handlers
    if(Meteor.connection._stream.status().connected) {
      self.disconnectHandlers().forEach(function forEachDisconnectHandler(cb) {
        cb.call(self);
      });
    }
  });

  // Attach message handlers
  Meteor.connection._stream.on('message', function onMessage(data) {

    // Parse the message
    const parsed_data = JSON.parse(data);

    // Retrieve the msg value
    const msg = parsed_data.msg;

    // And dismiss it
    delete parsed_data.msg;

    // If its the connected message
    if(msg === 'connected') {
      // Call each handlers
      self.connectHandlers().forEach(function forEachConnectHandler(cb) {
        cb.call(self);
      });
    }
    else if(msg) {
      // Else, call the appropriate handler
      self.handlers(msg).call(self, parsed_data);
    }
  });


};

Streamy._write = function(data) {
  Meteor.connection._stream.send(data);
};
