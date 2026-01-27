const db = require('../config/db');

exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query(
      'SELECT f.NovelID, n.Title FROM Favorites f JOIN Novels n ON f.NovelID = n.NovelID WHERE f.UserID = ?',
      [userId]
    );
    res.json({ favorites: results });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.addFavorite = async (req, res) => {
  const { userId, novelId } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO Favorites (UserID, NovelID) VALUES (?, ?)',
      [userId, novelId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, novelId } = req.params;
  try {
    await db.query(
      'DELETE FROM Favorites WHERE UserID = ? AND NovelID = ?',
      [userId, novelId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
