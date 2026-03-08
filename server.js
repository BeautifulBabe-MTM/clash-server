require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Чтобы сервер понимал JSON в теле запроса

// 1. ПОДКЛЮЧЕНИЕ К БАЗЕ (из .env)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// 2. ОПИСАНИЕ СХЕМЫ (Твои "чертежи" игрока)
const PlayerSchema = new mongoose.Schema({
  username: String,
  resources: { gold: Number, gems: Number },
  buildings: Array // Тут будут лежать твои домики [ {typeId, x, y}, ... ]
});

const Player = mongoose.model('Player', PlayerSchema);

// 3. ТВОИ РОУТЫ (Тот самый код)

// Сохранение базы
app.post('/save-layout', async (req, res) => {
  const { userId, newBuildings } = req.body;
  try {
    await Player.findByIdAndUpdate(userId, { buildings: newBuildings });
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Поиск врага
app.get('/find-match', async (req, res) => {
  try {
    const count = await Player.countDocuments();
    const random = Math.floor(Math.random() * count);
    const enemy = await Player.findOne().skip(random);
    
    if (!enemy) return res.status(404).send("Никого не нашли");

    res.json({
      enemyId: enemy._id,
      enemyName: enemy.username,
      buildings: enemy.buildings,
      potentialLoot: (enemy.resources.gold * 0.2).toFixed(0)
    });
  } catch (err) {
    res.status(500).send("Ошибка поиска");
  }
});

// 4. ЗАПУСК
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер летит на порту ${PORT}`);
});