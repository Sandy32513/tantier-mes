const express = require('express');

function createApiRouter(table, columns) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [rows] = await req.app.locals.db.query(`SELECT * FROM \`${table}\` ORDER BY id ASC`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${table}` });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const payload = columns.map((column) => req.body[column] ?? null);
      const sql = `INSERT INTO \`${table}\` (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
      const [result] = await req.app.locals.db.query(sql, payload);
      res.status(201).json({ id: result.insertId, message: 'Created' });
    } catch (error) {
      res.status(500).json({ error: `Failed to create ${table} record` });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const payload = columns.map((column) => req.body[column] ?? null);
      payload.push(Number(req.params.id));
      const sql = `UPDATE \`${table}\` SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?`;
      await req.app.locals.db.query(sql, payload);
      res.json({ message: 'Updated' });
    } catch (error) {
      res.status(500).json({ error: `Failed to update ${table} record` });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await req.app.locals.db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [Number(req.params.id)]);
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ error: `Failed to delete ${table} record` });
    }
  });

  return router;
}

module.exports = createApiRouter;
