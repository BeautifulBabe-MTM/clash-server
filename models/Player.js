const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  username: String,
  resources: {
    gold: { type: Number, default: 500 },
    gems: { type: Number, default: 10 }
  },
  // Массив зданий с координатами
  buildings: [{
    typeId: String, // например, "gold_mine" или "wall"
    x: Number,
    y: Number,
    level: { type: Number, default: 1 },
    lastCollect: Date // когда последний раз забирали золото
  }]
});

const Player = mongoose.model('Player', PlayerSchema);