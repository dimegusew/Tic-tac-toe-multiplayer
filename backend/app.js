let express = require("express");
let socket = require("socket.io");

let app = express();

let rooms = [];
let roomID;
server = app.listen(5000, function() {
  console.log("server is running on port 5000"); // server initialization
});

io = socket(server);

io.on("connection", socket => {
  socket.on("CONNECT_NEW_USER", () => {
    var room = Math.round(Math.random() * 1000000); // connected first user
    socket.join(room); // add him to new room
    io.emit("ADD_ROOM", { room: room });
    addRoom(room);

    socket.on("SEND_MESSAGE", data => {
      io.to(room).emit("RECEIVE_MESSAGE", data); //first user message sending
    });
    console.log("first user add" + " " + room);

    socket.on("SEND_GAME_MAP", data => {
      io.to(room).emit("RECIVE_GAME_MAP", data); // first user game map
    });

    socket.on("SEND_USERS_SEQUENCE", data => {
      io.to(room).emit("RECIVE_USERS_SEQUENCE", data); // first user sequence
    });
    socket.on("SEND_USERS_FIG", data => {
      io.to(room).emit("RECIVE_USERS_FIG", data); // first user figure
    });
  });

  socket.on("CONNECT_SECOND_USER", data => {  // connected second user
    let roomId = data.roomId;

    if (!containsTheRoom(roomId)) { // room check
      io.emit("message", { message: "Room not found" });
    } else {
      console.log("second user add" + " " + roomId);

      io.in(data.roomId).clients((err, clients) => {
        if (clients.length < 2) {
          socket.join(roomId);
          io.to(roomId).emit("message", {
            message: "Second Player join Game",
            condition: true
          });
        }
      });


      socket.on("SEND_MESSAGE", data => { //seecond user message sending
        io.to(roomId).emit("RECEIVE_MESSAGE", data);
      });

      socket.on("SEND_GAME_MAP", data => {
        io.to(roomId).emit("RECIVE_GAME_MAP", data); // second user game map
      });

      socket.on("SEND_USERS_SEQUENCE", data => {
        io.to(roomId).emit("RECIVE_USERS_SEQUENCE", data); //second user user sequence
      });

      socket.on("SEND_USERS_FIG", data => {
        io.to(roomId).emit("RECIVE_USERS_FIG", data);  // second user send figure
      });
    }
  });
});

function addRoom(roomId) {
  rooms.push(roomId);
}

function containsTheRoom(roomId) {
  return rooms.indexOf(roomId) !== -1 ? false : true;
}
