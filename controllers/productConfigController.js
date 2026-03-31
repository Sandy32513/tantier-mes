function handleError(res, error, fallbackMessage) {
  res.status(error.statusCode || 500).json({
    error: error.message || fallbackMessage
  });
}

function createProductConfigController(model, entityLabel) {
  return {
    async list(req, res) {
      try {
        const rows = await model.list(req.app.locals.db);
        res.json(rows);
      } catch (error) {
        handleError(res, error, `Failed to fetch ${entityLabel} records.`);
      }
    },

    async create(req, res) {
      try {
        const row = await model.create(req.app.locals.db, req.body);
        res.status(201).json({
          message: `${entityLabel} revision created successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to create ${entityLabel} record.`);
      }
    },

    async update(req, res) {
      try {
        const row = await model.update(req.app.locals.db, req.params.id, req.body);
        res.json({
          message: `${entityLabel} revision updated successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to update ${entityLabel} record.`);
      }
    },

    async remove(req, res) {
      try {
        await model.remove(req.app.locals.db, req.params.id);
        res.json({ message: `${entityLabel} revision deleted successfully.` });
      } catch (error) {
        handleError(res, error, `Failed to delete ${entityLabel} record.`);
      }
    },

    async copy(req, res) {
      try {
        const row = await model.copy(req.app.locals.db, req.params.id);
        res.status(201).json({
          message: `${entityLabel} revision copied successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to copy ${entityLabel} revision.`);
      }
    },

    async release(req, res) {
      try {
        const row = await model.release(req.app.locals.db, req.params.id);
        res.json({
          message: `${entityLabel} revision released successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to release ${entityLabel} revision.`);
      }
    },

    async archive(req, res) {
      try {
        const row = await model.archive(req.app.locals.db, req.params.id);
        res.json({
          message: `${entityLabel} revision archived successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to archive ${entityLabel} revision.`);
      }
    },

    async activate(req, res) {
      try {
        const row = await model.activate(req.app.locals.db, req.params.id);
        res.json({
          message: `${entityLabel} revision activated successfully.`,
          row
        });
      } catch (error) {
        handleError(res, error, `Failed to activate ${entityLabel} revision.`);
      }
    }
  };
}

module.exports = createProductConfigController;
