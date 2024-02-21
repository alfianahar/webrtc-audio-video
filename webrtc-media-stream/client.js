import "./style.css";
import SimplePeerWrapper from "simple-peer-wrapper/dist/simple-peer-wrapper.min.js";

let localStream;
let remoteStream;
let peer;

// Get references to HTML elements
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL;

async function startMediaStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localVideo.srcObject = localStream;
    peer = new SimplePeerWrapper({
      serverUrl: SIGNALING_SERVER_URL,
      debug: true,
      stream: localStream,
    });

    // Connect to the peer
    peer.connect();
    const isStarted = peer.isConnectionStarted();
    console.log({ isStarted });

    peer.on("connect", () => {
      setConnected(true);
      console.log("Peer connected2", peer.isConnectionStarted());
      const interval = setInterval(() => {
        console.log("sending hardware info continously", dummyHardwareInfo);
        console.log("sending robot pose info continously", robotPoseInfo);
        peer.send(dummyHardwareInfo);
        peer.send(robotPoseInfo);
        // peer.send({header: {status_id: 0}, payload: {hardware: "dummy data"}});
        // peer.send({header: {status_id: 3}, payload: {pose:"dummy data"}});
      }, 1000);
      return () => clearInterval(interval);
    });

    peer.on("stream", (incomingStream) => {
      console.log("remote stream received", incomingStream);
      if (remoteVideo) {
        remoteVideo.srcObject = incomingStream;
      }
    });
  } catch (error) {
    console.error("Error accessing user media:", error);
  }
}

function stopConnection() {
  peer.close();
  console.log("stop");
  // Stop local media tracks
  localStream.getTracks().forEach((track) => track.stop());

  // // Clear video elements
  localVideo.srcObject = null;
  // remoteVideo.srcObject = null;
}

startButton.addEventListener("click", () => {
  startMediaStream();
});

stopButton.addEventListener("click", () => {
  stopConnection();
});
