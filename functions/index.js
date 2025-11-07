// Firebase Cloud Functions para enviar notificações automáticas
// Quando você mudar o status do pedido no Firebase, esta função detecta e envia notificação

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Mensagens de notificação por status
const statusNotifications = {
    'Pendente': {
        title: '✅ Pedido Recebido!',
        body: 'Seu pedido foi recebido e está sendo processado.'
    },
    'Em Preparo': {
        title: '👨‍🍳 Preparando seu Pedido!',
        body: 'Estamos preparando seu pedido com muito carinho!'
    },
    'Pronto': {
        title: '✅ Pedido Pronto!',
        body: 'Seu pedido está pronto e aguardando entrega!'
    },
    'Saiu para Entrega': {
        title: '🛵 Saiu para Entrega!',
        body: 'Seu pedido está a caminho! O entregador já saiu.'
    },
    'Entregue': {
        title: '🎉 Pedido Entregue!',
        body: 'Seu pedido foi entregue! Bom apetite! 😋'
    },
    'Cancelado': {
        title: '❌ Pedido Cancelado',
        body: 'Seu pedido foi cancelado. Entre em contato se tiver dúvidas.'
    }
};

// Função que detecta quando o status do pedido muda
exports.enviarNotificacaoMudancaStatus = functions.database
    .ref('/delivery_pedidos/{pedidoId}/status')
    .onUpdate(async (change, context) => {
        const pedidoId = context.params.pedidoId;
        const novoStatus = change.after.val();
        const statusAnterior = change.before.val();

        console.log(`Pedido ${pedidoId}: Status mudou de "${statusAnterior}" para "${novoStatus}"`);

        // Busca os dados completos do pedido
        const pedidoSnapshot = await admin.database()
            .ref(`/delivery_pedidos/${pedidoId}`)
            .once('value');
        
        const pedido = pedidoSnapshot.val();

        // Verifica se o pedido tem token FCM
        if (!pedido || !pedido.fcmToken) {
            console.log('Pedido não tem token FCM. Notificação não enviada.');
            return null;
        }

        // Busca a mensagem correspondente ao status
        const notification = statusNotifications[novoStatus];

        if (!notification) {
            console.log(`Sem mensagem definida para o status: ${novoStatus}`);
            return null;
        }

        // Monta a mensagem de notificação
        const message = {
            token: pedido.fcmToken,
            notification: {
                title: notification.title,
                body: `Pedido ${pedido.codigo}: ${notification.body}`
            },
            data: {
                pedidoId: pedidoId,
                codigo: pedido.codigo,
                status: novoStatus,
                timestamp: new Date().toISOString()
            },
            webpush: {
                fcmOptions: {
                    link: 'https://seu-site.com/index.html' // SUBSTITUA pela URL do seu site
                },
                notification: {
                    icon: '/img/logo.png',
                    badge: '/img/badge.png',
                    vibrate: [200, 100, 200]
                }
            }
        };

        // Envia a notificação
        try {
            const response = await admin.messaging().send(message);
            console.log('✅ Notificação enviada com sucesso:', response);
            return response;
        } catch (error) {
            console.error('❌ Erro ao enviar notificação:', error);
            return null;
        }
    });
