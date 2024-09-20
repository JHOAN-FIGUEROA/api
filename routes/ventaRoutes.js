const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Obtener todas las ventas
router.get('/', ventaController.getVentas);

// Obtener una venta por ID
router.get('/:id', ventaController.getVentaById);

// Crear una nueva venta
router.post('/', ventaController.createVenta);

// Actualizar una venta por ID
router.put('/:id', ventaController.updateVenta);

// Eliminar una venta por ID (se anula en lugar de eliminar)
router.delete('/:id', async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Anular la venta
        venta.estado = 'cancelada';
        await venta.save();

        // Actualizar stock de productos
        for (const producto of venta.productos_servicio) {
            const productoDB = await Producto.findById(producto.producto_servicio_id);
            if (productoDB) {
                productoDB.cantidad += producto.cantidad;
                await productoDB.save();
            } else {
                throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
            }
        }

        res.status(200).json({ message: 'Venta anulada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

