import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:9595/lostfound/ws';

let stompClient = null;

// ================= CONNECT =================
export const connectWebSocket = (username, onMessageReceived, onUsersUpdated) => {
    const socket = new SockJS(SOCKET_URL);

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
            // ✅ Subscribe to messages
            stompClient.subscribe('/topic/messages', (message) => {
                const body = JSON.parse(message.body);
                onMessageReceived(body);
            });

            // ✅ Subscribe to online users
            stompClient.subscribe('/topic/users', (message) => {
                const users = JSON.parse(message.body);
                onUsersUpdated(users);
            });

            // ✅ Register user
            stompClient.publish({
                destination: '/app/register',
                body: JSON.stringify({
                    sender: username,
                    type: 'JOIN',
                    content: '',
                    timestamp: new Date().toISOString()
                })
            });
        },
        onDisconnect: () => {
            console.log('Disconnected from WebSocket');
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame);
        }
    });

    stompClient.activate();
};

// ================= SEND MESSAGE =================
export const sendMessage = (sender, content) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: '/app/sendMessage',
            body: JSON.stringify({
                sender,
                content,
                type: 'CHAT',
                timestamp: new Date().toISOString()
            })
        });
    }
};

// ================= DISCONNECT =================
export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
    }
};
