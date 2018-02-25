import React, {Component} from "react";

class Chat extends Component {
  componentDidUpdate() {
    let msg = document.getElementById("msgs");
    msg.scrollTo(0, msg.scrollHeight);
  }

  render() {
    let {
      message,
      messages,
      sendMessage,
      userId,
      secondUserInGame,
      messageChange
    } = this.props;

    let sendAllowed = secondUserInGame && message !== "";
    return (
      <div className="Chat">
        <div className="messages" id="msgs">
          {!secondUserInGame ? (
            <p className="info">
              You can chat with your friend when he/she join the game{" "}
            </p>
          ) : (
            <div>
              {messages.map((message, i) => {
                return (
                  <div className="message" key={i}>
                    {userId === message.author ? (
                      <div className="your-message">
                        <p>{message.message}</p>
                      </div>
                    ) : (
                      <div className="companion-message">
                        <p>{message.message}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-footer">
          <input
            type="text"
            placeholder="Message"
            className="message-input"
            value={message}
            onChange={ev => {
              messageChange(ev.target.value);
            }}
            onKeyPress={ev =>
              ev.charCode === 13 && sendAllowed ? sendMessage(ev) : ""
            }
          />
          <button
            onClick={sendMessage}
            disabled={sendAllowed ? "" : "disabled"}
            className="send-btn"
          >
            send
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;
