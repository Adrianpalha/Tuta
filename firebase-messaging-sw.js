// Service Worker para Firebase Cloud Messaging
// Este arquivo permite receber notificações mesmo quando o site está fechado

// Importa scripts do Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Configuração Firebase (MESMA do index.html)
const firebaseConfig = {
    apiKey: "AIzaSyCxokW1qooUb0RRU2IqdvZHvObuYSv9AL0",
    authDomain: "tuta-lanches.firebaseapp.com",
    databaseURL: "https://tuta-lanches-default-rtdb.firebaseio.com",
    projectId: "tuta-lanches",
    storageBucket: "tuta-lanches.firebasestorage.app",
    messagingSenderId: "479951848",
    appId: "1:479951848:web:262562993fcac563bdc25d",
    measurementId: "G-0ZQMDSDYGJ"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa Messaging
const messaging = firebase.messaging();

// Recebe notificações em background (quando o site está fechado)
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Notificação recebida em background:', payload);

    const notificationTitle = payload.notification.title || 'Atualização do Pedido';
    const notificationOptions = {
        body: payload.notification.body || 'Seu pedido foi atualizado!',
        icon: payload.notification.icon || '/img/logo.png',
        badge: '/img/badge.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'pedido-update',
        requireInteraction: false,
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Evento de clique na notificação
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notificação clicada:', event.notification.tag);
    event.notification.close();

    // Abre ou foca na janela do site
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Se já tiver uma janela aberta, foca nela
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se não tiver janela aberta, abre uma nova
            if (clients.openWindow) {
                return clients.openWindow('/index.html');
            }
        })
    );
});
