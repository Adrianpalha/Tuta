# 🔔 Sistema de Notificações Push - Instruções de Configuração

## ✅ O QUE FOI IMPLEMENTADO:

1. **index.html** - Cliente recebe notificações automaticamente
2. **firebase-messaging-sw.js** - Service Worker para notificações em background
3. **functions/index.js** - Cloud Function que detecta mudança de status e envia notificação

---

## 🔧 CONFIGURAÇÃO (PASSO A PASSO):

### PASSO 1: Gerar Chave VAPID no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **tuta-lanches**
3. Clique no ícone de **engrenagem** (⚙️) → **Project Settings**
4. Vá na aba **Cloud Messaging**
5. Role até **Web Push certificates**
6. Clique em **Generate key pair**
7. **COPIE** a chave gerada (começa com "B...")

**Substitua no `index.html` (linha ~896):**
```javascript
const VAPID_KEY = "COLE_SUA_CHAVE_VAPID_AQUI";
```

---

### PASSO 2: Instalar Firebase CLI (se ainda não tiver)

Abra o PowerShell e execute:

```powershell
npm install -g firebase-tools
```

Faça login:

```powershell
firebase login
```

---

### PASSO 3: Inicializar Firebase Functions

No diretório do projeto (delivery), execute:

```powershell
cd c:\Users\Adria\OneDrive\Documentos\delivery
firebase init functions
```

**Escolha as opções:**
- Use an existing project → **tuta-lanches**
- Language → **JavaScript**
- ESLint → **No** (ou Yes, tanto faz)
- Install dependencies → **Yes**

---

### PASSO 4: Copiar o código da Cloud Function

Os arquivos já foram criados em `functions/`:
- `functions/index.js` - Código da função
- `functions/package.json` - Dependências

Se precisar reinstalar dependências:

```powershell
cd functions
npm install
cd ..
```

---

### PASSO 5: Deploy da Cloud Function

```powershell
firebase deploy --only functions
```

**Aguarde** a função ser implantada (pode demorar 1-2 minutos).

**Você verá:**
```
✔ functions[enviarNotificacaoMudancaStatus] Successful create operation.
Function URL: https://...
```

---

### PASSO 6: Ativar Cloud Messaging API

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto **tuta-lanches**
3. Vá em **APIs & Services** → **Library**
4. Pesquise: **Firebase Cloud Messaging API**
5. Clique em **ENABLE** (Ativar)

---

### PASSO 7: Atualizar plano do Firebase (se necessário)

**Cloud Functions NÃO funciona no plano gratuito Spark!**

Você precisa fazer upgrade para **Blaze (Pay as you go)**:

1. Firebase Console → ⚙️ → **Usage and billing**
2. Clique em **Modify plan**
3. Selecione **Blaze**
4. Configure limite de gastos (ex: $5/mês para evitar surpresas)

**OBS:** O plano Blaze é grátis até certo limite de uso. Para um delivery pequeno/médio, provavelmente ficará grátis.

---

## 📱 COMO FUNCIONA AGORA:

### Fluxo Automático:

1. **Cliente busca pedido** no site → Aceita permissão de notificação
2. **Token FCM é salvo** automaticamente no Firebase (campo `fcmToken`)
3. **Você muda o status** na sua página de delivery (outro site)
4. **Cloud Function detecta** a mudança automaticamente
5. **Notificação é enviada** para o celular do cliente
6. **Cliente recebe** mesmo com site fechado! 🎉

### Você não precisa fazer NADA manualmente!

Só mudar o status do pedido no Firebase que a notificação sai automaticamente.

---

## 🎯 MENSAGENS POR STATUS:

- **Pendente**: "✅ Pedido Recebido! Seu pedido foi recebido e está sendo processado."
- **Em Preparo**: "👨‍🍳 Preparando seu Pedido! Estamos preparando com muito carinho!"
- **Pronto**: "✅ Pedido Pronto! Aguardando entrega!"
- **Saiu para Entrega**: "🛵 Saiu para Entrega! O entregador já saiu."
- **Entregue**: "🎉 Pedido Entregue! Bom apetite! 😋"
- **Cancelado**: "❌ Pedido Cancelado"

---

## 🌐 COMPATIBILIDADE:

### ✅ Funciona 100%:
- Chrome (Desktop e Android)
- Edge (Desktop e Android)
- Firefox (Desktop e Android)
- Opera (Desktop e Android)

### ⚠️ Funciona com limitações:
- iPhone/iPad (iOS 16.4+) - **APENAS como PWA** (instalado na tela inicial)

---

## 🚨 PROBLEMAS COMUNS:

### "Cloud Function não está enviando notificação"
- Verifique se fez deploy: `firebase deploy --only functions`
- Confirme que está no plano **Blaze**
- Veja os logs: `firebase functions:log`

### "Token não está sendo salvo"
- Verifique se a chave VAPID está correta no index.html
- Confirme que Cloud Messaging API está ativada

### "Erro de permissão negada"
- Cliente precisa permitir notificações no navegador
- Teste em HTTPS ou localhost

---

## 🔍 TESTAR O SISTEMA:

### 1. Teste no Cliente:
```
1. Abra index.html
2. Vá em "Acompanhar Pedido"
3. Digite código do pedido
4. Aceite permissão de notificação
5. Verifique Console (F12): "Token salvo no pedido!"
```

### 2. Verifique no Firebase:
```
1. Firebase Console → Realtime Database
2. Abra delivery_pedidos → {seu_pedido}
3. Confirme que tem campo "fcmToken"
```

### 3. Mude o Status:
```
1. Na sua página de delivery, mude o status
2. Cliente deve receber notificação em segundos!
```

### 4. Veja os Logs:
```powershell
firebase functions:log
```

---

## 💰 CUSTOS (Plano Blaze):

**Cloud Functions gratuito até:**
- 2 milhões de invocações/mês
- 400.000 GB-segundos/mês
- 200.000 GHz-segundos/mês

**Para um delivery pequeno/médio:**
- Provavelmente ficará **100% grátis**
- Cada mudança de status = 1 invocação
- 1000 pedidos/mês = 4000-5000 invocações (muito abaixo do limite)

Configure limite de gastos para evitar surpresas!

---

## 📂 ARQUIVOS CRIADOS:

1. **index.html** (modificado):
   - Solicita permissão de notificação
   - Salva token FCM no Firebase

2. **firebase-messaging-sw.js** (novo):
   - Service Worker para notificações em background

3. **functions/index.js** (novo):
   - Cloud Function que detecta mudanças
   - Envia notificações automaticamente

4. **functions/package.json** (novo):
   - Dependências da função

---

## � COMANDOS ÚTEIS:

```powershell
# Ver logs da função
firebase functions:log

# Fazer deploy novamente
firebase deploy --only functions

# Deletar função (se precisar)
firebase functions:delete enviarNotificacaoMudancaStatus

# Ver status do projeto
firebase projects:list
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO:

- [ ] Chave VAPID gerada e colada no index.html
- [ ] Firebase CLI instalado
- [ ] `firebase init functions` executado
- [ ] `firebase deploy --only functions` executado com sucesso
- [ ] Cloud Messaging API ativada
- [ ] Plano Blaze ativado
- [ ] Testado: Cliente aceita notificação
- [ ] Testado: Token salvo no Firebase
- [ ] Testado: Mudança de status envia notificação

---

**Sistema pronto! Agora é automático! 🚀**

Quando você mudar o status do pedido na sua página de delivery, a notificação será enviada automaticamente para o cliente!

