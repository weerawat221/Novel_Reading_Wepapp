const db = require('../config/db');

exports.getUserHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query(
      `SELECT h.NovelID, n.Title, h.ChapterID, c.ChapterNumber, h.LastReadAt
       FROM ReadingHistory h
       JOIN Novels n ON h.NovelID = n.NovelID
       LEFT JOIN Chapters c ON h.ChapterID = c.ChapterID
       WHERE h.UserID = ?
       ORDER BY h.LastReadAt DESC`,
      [userId]
    );
    res.json({ history: results });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateHistory = async (req, res) => {
  const { userId, novelId, chapterId } = req.body;
  try {
    await db.query(
      `INSERT INTO ReadingHistory (UserID, NovelID, ChapterID, LastReadAt) VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE ChapterID = VALUES(ChapterID), LastReadAt = NOW()` ,
      [userId, novelId, chapterId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
