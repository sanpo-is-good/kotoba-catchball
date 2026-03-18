const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory room storage
const rooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Rule-based AI judge
function judgeMessage(text, prevMessage) {
  const GRATITUDE_WORDS = [
    'ありがとう', 'うれしい', '嬉しい', 'いいね', 'すごい', 'すごいね',
    '好き', '最高', 'なるほど', 'たしかに', '確かに', 'よかった', 'さすが',
    '素敵', 'すてき', 'いい感じ', 'そういうところ', '共感'
  ];
  const FIRST_PERSON_RE = /私|僕|俺|わたし|ぼく|自分|うち|あたし|俺は|僕は|私は/;

  const hasQuestion = /[?？]/.test(text);
  const hasGratitude = GRATITUDE_WORDS.some(w => text.includes(w));
  const isDetailed = text.length > 30;
  const hasSelfDisclosure = FIRST_PERSON_RE.test(text);

  // Check if current message "receives" previous message (word overlap)
  let received = false;
  if (prevMessage && prevMessage.length > 0) {
    const words = prevMessage.split(/[\s、。！？!?\n]+/).filter(w => w.length >= 2);
    received = words.some(w => text.includes(w));
  }

  // Determine pitch type
  let pitchType;
  if (hasGratitude) pitchType = 'golden';
  else if (hasSelfDisclosure && isDetailed) pitchType = 'spin';
  else if (hasQuestion && received) pitchType = 'lob';
  else if (hasQuestion && !received) pitchType = 'curve';
  else pitchType = 'straight';

  // Calculate score
  let scoreDelta = 10; // base
  if (received) scoreDelta += 10;
  if (hasSelfDisclosure) scoreDelta += 10;
  if (hasQuestion) scoreDelta += 10;
  if (hasGratitude) scoreDelta += 20;
  if (isDetailed) scoreDelta += 15;

  // Feedback text
  const feedbackMap = {
    golden: '✨ ゴールデンボール！',
    spin:   '🌀 スピン！エピソード豊かな球',
    lob:    '🎯 ロブ！返しやすい球',
    curve:  '💫 カーブ！変化球',
    straight: '⚡ ストレート！',
  };

  return {
    received,
    selfDisclosure: hasSelfDisclosure,
    asksQuestion: hasQuestion,
    gratitude: hasGratitude,
    novelty: isDetailed ? 2 : 0,
    pitchType,
    speed: pitchType === 'straight' ? 5 : pitchType === 'golden' ? 2 : 3,
    scoreDelta,
    feedbackText: feedbackMap[pitchType],
  };
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('connected:', socket.id);

    socket.on('create-room', ({ name }) => {
      const roomId = generateRoomId();
      const player = { id: socket.id, name };
      rooms.set(roomId, {
        id: roomId,
        players: [player],
        messages: [],
        score: 0,
        rally: 0,
        lastMessageByPlayer: {},
        status: 'waiting',
      });
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.playerName = name;
      socket.emit('room-created', { roomId });
      console.log('room created:', roomId);
    });

    socket.on('join-room', ({ roomId, name }) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('room-error', { message: 'ルームが見つかりません' });
        return;
      }
      if (room.players.length >= 2) {
        socket.emit('room-error', { message: 'ルームは満員です' });
        return;
      }
      const player = { id: socket.id, name };
      room.players.push(player);
      room.status = 'playing';
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.playerName = name;

      io.to(roomId).emit('game-start', {
        room: {
          id: room.id,
          players: room.players,
          score: room.score,
          rally: room.rally,
          status: room.status,
        },
      });
      console.log('game started in room:', roomId);
    });

    socket.on('send-message', ({ text }) => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      if (!room || !text.trim()) return;

      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      const opponent = room.players.find(p => p.id !== socket.id);
      const prevMessage = opponent ? (room.lastMessageByPlayer[opponent.id] || null) : null;

      const judgeResult = judgeMessage(text.trim(), prevMessage);

      room.rally += 1;
      let bonusScore = 0;
      if (room.rally >= 10) bonusScore = 30;
      else if (room.rally >= 5) bonusScore = 20;
      else if (room.rally >= 3) bonusScore = 10;

      room.score += judgeResult.scoreDelta + bonusScore;
      room.lastMessageByPlayer[socket.id] = text.trim();

      const isGameOver = room.score >= 300;
      if (isGameOver) room.status = 'finished';

      const message = {
        id: uuidv4(),
        playerId: socket.id,
        playerName: player.name,
        text: text.trim(),
        timestamp: Date.now(),
        judgeResult,
        bonusScore,
      };
      room.messages.push(message);

      io.to(roomId).emit('message-received', {
        message,
        room: {
          id: room.id,
          players: room.players,
          score: room.score,
          rally: room.rally,
          status: room.status,
          messages: room.messages,
        },
      });
    });

    socket.on('disconnect', () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;
      const room = rooms.get(roomId);
      if (!room) return;
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit('player-left', {
          playerName: socket.data.playerName,
        });
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
