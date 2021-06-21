import express, { Application, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import { baseUrl } from "./config/app";
import SessionStore from "./SessionStore";

const app: Application = express();
const PORT = 5000;
const sessionStore = new SessionStore();

const getUniqueId = () => nanoid();

// don't forget to pass a deep copy...
const getUserVotes = (options: any, userID: string) => {
  for (let key in options) {
    let option = options[key];
    if (option.votes[userID]) {
      option.selected = true;
    }
  }
  return options;
};

app.use(express.json());
app.post("/get_link", async (req, res) => {
  // get stuff from body
  let { userID, pollName, pollOptions, multipleAnswers, anonymousVoting } =
    req.body;

  //TODO validate stuff from body

  // generate a unique hash

  let sessionID = getUniqueId();

  // create a session

  sessionStore.createSession(sessionID, {
    pollOptions,
    meta: {
      pollName,
      multipleAnswers,
      anonymousVoting,
      pollCreator: userID,
      alreadyVoted: {},
    },
  });

  // response with a link

  res.json({ sessionID });
});

app.post("validate_session", async (req, res) => {
  let { id } = req.body;
});

const server = app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// setInterval(() => {
//   console.log("setInterval is executed every second....");
// }, 1000);

io.use((socket: any, next) => {
  let { sessionID, userID, username, photoURL } = socket.handshake.auth;

  if (!sessionID || !userID) {
    return next(new Error("Invalid session indentifier."));
  }

  let session = sessionStore.getSessionById(sessionID);

  if (!session) {
    return next(new Error("Poll has expired."));
  }

  socket.sessionID = sessionID;
  socket.userID = userID;
  socket.username = username;
  socket.photoURL = photoURL;
  next();
});

io.on("connection", (socket: any) => {
  let sessionID = socket.sessionID;
  let session = sessionStore.getSessionById(sessionID);
  let users: any = {};

  for (let instance of io.of("/").sockets) {
    let socket = instance[1] as any;
    users[socket.userID] = {
      username: socket.username,
      photoURL: socket.photoURL,
    };
  }

  // join session...
  socket.join(sessionID);
  // to be in sync with multiple tabs
  socket.join(socket.userID);
  // send sessions' data
  socket.emit("session", {
    pollOptions: session.pollOptions,
    meta: session.meta,
    users,
  });
  // notify others about recent connection
  socket
    .to(sessionID)
    .emit("user_connected", {
      id: socket.userID,
      username: socket.username,
      photoURL: socket.photoURL,
    });
  //
  socket.on("voted", (args: any) => {
    if (args.votes) {
      // update sessions' votes
      for (let key of Object.keys(args.votes)) {
        session.pollOptions[key].votes[socket.userID] = {
          username: socket.username,
          photoURL: socket.photoURL,
        };
      }

      session.meta.alreadyVoted[socket.userID] = { username: socket.username };
      io.to(sessionID).to(socket.userID).emit("voted", {
        pollOptions: session.pollOptions,
        meta: session.meta,
      });
    }
    console.log("someone voted: ....", session);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    socket.to(sessionID).emit("user_disconnected", { id: socket.userID });
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err: any, req: Request, res: Response) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error." });
});
