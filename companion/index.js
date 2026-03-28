import * as messaging from "messaging";

messaging.peerSocket.onmessage = (evt) => {
  const data = evt.data;

  if (data.type === "webhook") {
    const headers = {
      "Content-Type": "text/plain",
      "Markdown": "yes" // Enables **bold**, # headings, and - lists
    };

    // If the page has a clickUrl, add it to the ntfy headers
    if (data.clickUrl) {
      headers["Click"] = data.clickUrl;
    }

    fetch(data.url, {
      method: "POST",
      headers: headers,
      body: data.body
    })
    .then(() => console.log("ntfy rich notification sent"))
    .catch(err => console.error("ntfy error: " + err));
  }

  if (data.type === "slack") {
    fetch(data.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.body)
    }).catch(err => console.error("Slack error: " + err));
  }
};