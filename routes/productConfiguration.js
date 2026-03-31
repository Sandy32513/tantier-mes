const express = require('express');
const createProductConfigController = require('../controllers/productConfigController');
const manufacturingRouteModel = require('../models/manufacturingRouteModel');
const bomModel = require('../models/bomModel');
const productSpecModel = require('../models/productSpecModel');
const commonProductSpecModel = require('../models/commonProductSpecModel');
const packingSpecModel = require('../models/packingSpecModel');

const router = express.Router();

function registerProductConfigRoutes(basePath, controller) {
  router.get(basePath, controller.list);
  router.post(basePath, controller.create);
  router.post(`${basePath}/:id/copy`, controller.copy);
  router.post(`${basePath}/:id/release`, controller.release);
  router.post(`${basePath}/:id/activate`, controller.activate);
  router.post(`${basePath}/:id/set-default`, controller.activate);
  router.post(`${basePath}/:id/archive`, controller.archive);
  router.put(`${basePath}/:id`, controller.update);
  router.delete(`${basePath}/:id`, controller.remove);
}

[
  {
    basePath: '/manufacturing-routes',
    controller: createProductConfigController(manufacturingRouteModel, 'Manufacturing Route')
  },
  {
    basePath: '/bill-of-materials',
    controller: createProductConfigController(bomModel, 'Bill of Materials')
  },
  {
    basePath: '/product-spec',
    controller: createProductConfigController(productSpecModel, 'Product Spec')
  },
  {
    basePath: '/common-product-spec',
    controller: createProductConfigController(commonProductSpecModel, 'Common Product Spec')
  },
  {
    basePath: '/packing-spec',
    controller: createProductConfigController(packingSpecModel, 'Packing Spec')
  }
].forEach(({ basePath, controller }) => registerProductConfigRoutes(basePath, controller));

module.exports = router;
