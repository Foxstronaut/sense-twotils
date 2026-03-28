import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";

const textData = [
  { 
    content: "# PROJECT DASHBOARD\n\n- **Status**: Active\n- **Mode**: Double-tap\n- **Rich Text**: Enabled", 
    type: "text" 
  },
  { 
    content: "OPEN GOOGLE\n\nDouble-tap to send a ntfy alert that opens Google when clicked.", 
    type: "webhook", 
    url: "https://ntfy.sh/fitbitifications",
    body: "**Action Required**: Open the search engine.",
    clickUrl: "https://lhsconnect.com/"
  },
  { 
    content: "SLACK TRIGGER\n\nDouble-tap to ping the team.", 
    type: "slack", 
    url: "https://hooks.slack.com/triggers/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",
    body: { "Channel": "CP0CEQ2R1", "Message": "Testing **Fitbit Button** to send slack message. \n testing multiline \n - and lists \n - eee \nI'm really excited if this works" }
  }
];

let currentIndex = 0;
let lastTap = 0;
const textDisplay = document.getElementById("text-display");
const background = document.getElementById("background");

function updateDisplay() {
  textDisplay.text = textData[currentIndex].content;
}

function handleInteraction() {
  const item = textData[currentIndex];
  const now = Date.now();
  const delta = now - lastTap;

  if (delta > 30 && delta < 400) {
    // DOUBLE TAP: Trigger Webhook/Slack
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(item);
      if (vibration) vibration.start("confirmation-max");
    }
    lastTap = 0;
  } else {
    // SINGLE TAP: Cycle Page
    lastTap = now;
    setTimeout(() => {
      if (lastTap !== 0) {
        currentIndex = (currentIndex + 1) % textData.length;
        updateDisplay();
        lastTap = 0;
      }
    }, 400);
  }
}

textDisplay.onclick = handleInteraction;
background.onclick = handleInteraction;
updateDisplay();