class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        if (openButton) {
            openButton.addEventListener('click', () => this.toggleState(chatBox));
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        }

        const node = chatBox ? chatBox.querySelector('input') : null;
        if (node) {
            node.addEventListener("keyup", ({ key }) => {
                if (key === "Enter") {
                    this.onSendButton(chatBox);
                }
            });
        }
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (chatbox) {
            if (this.state) {
                chatbox.classList.add('chatbox--active');
            } else {
                chatbox.classList.remove('chatbox--active');
            }
        }
    }

    onSendButton(chatbox) {
        if (!chatbox) return;

        const textField = chatbox.querySelector('input');
        const text1 = textField ? textField.value : "";
        if (text1 === "") {
            return;
        }

        const msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch('http://192.168.0.187:8080/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                const msg2 = { name: "sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                if (textField) textField.value = '';
            })
            .catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                if (textField) textField.value = '';
            });
    }

    updateChatText(chatbox) {
        if (!chatbox) return;

        let html = '';
        this.messages.slice().reverse().forEach(function (item) {
            if (item.name === "sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        if (chatmessage) {
            chatmessage.innerHTML = html;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new Chatbox();
    chatbox.display();
});
