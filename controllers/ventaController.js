const Venta = require('../models/Venta');
const Producto = require('../models/ProductoServicio');

// Función para obtener el siguiente _id disponible para una venta
const getNextVentaId = async () => {
    try {
        const lastVenta = await Venta.findOne().sort({ _id: -1 }).exec();
        if (lastVenta) {
            const lastId = parseInt(lastVenta._id.replace('venta_', ''), 10);
            const nextId = lastId + 1;
            return `venta_${nextId.toString().padStart(3, '0')}`;
        }
        return 'venta_001';
    } catch (error) {
        throw new Error('Error al obtener el siguiente ID de venta');
    }
};

// Obtener todas las ventas
exports.getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
    }
};

// Crear una nueva venta
exports.createVenta = async (req, res) => {
    try {
        const { cliente, fecha, estado, productos_servicios, total } = req.body;

        // Crear la venta
        const newVenta = new Venta({
            cliente,
            fecha,
            estado,
            productos_servicios,
            total,
        });

        // Si la venta está en estado 'completada', actualizamos las cantidades
        if (estado === 'completada') {
            for (let item of productos_servicios) {
                const producto = await Producto.findById(item.producto_servicio_id);

                if (!producto) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                // Restar la cantidad del producto vendida
                if (producto.cantidad < item.cantidad) {
                    return res.status(400).json({ error: `Cantidad insuficiente en el inventario del producto: ${producto.nombre}` });
                }

                producto.cantidad -= item.cantidad;

                // Guardar el producto con la cantidad actualizada
                await producto.save();
            }
        }

        // Guardar la venta
        await newVenta.save();

        res.status(201).json(newVenta);
    } catch (error) {
        console.error('Error al crear la venta:', error);
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una venta
exports.updateVenta = async (req, res) => {
    try {
        const ventaId = req.params.id;
        const { cliente, fecha, estado, productos_servicios, total } = req.body;

        const venta = await Venta.findById(ventaId);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        venta.cliente = cliente;
        venta.fecha = fecha;
        venta.estado = estado;
        venta.productos_servicios = productos_servicios;
        venta.total = total;

        await venta.save();

        res.status(200).json(venta);
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(400).json({ error: error.message });
    }
};

// Anular una venta
exports.deleteVenta = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Log para verificar que estamos anulando la venta
        console.log('Anulando la venta:', venta._id);

        // Cambiar el estado a 'cancelada'
        venta.estado = 'cancelada';
        await venta.save();
        console.log(`Estado de la venta actualizado a: ${venta.estado}`);

        // Devolver productos al inventario
        for (const producto of venta.productos_servicios) {
            console.log(`Procesando producto ${producto.producto_servicio_id}`);

            const productoDB = await Producto.findById(producto.producto_servicio_id);

            if (productoDB) {
                // Sumar la cantidad vendida de vuelta al inventario
                productoDB.cantidad += producto.cantidad;
                console.log(`Devolviendo ${producto.cantidad} unidades del producto ${productoDB.nombre} al inventario.`);

                // Guardar el producto con la cantidad actualizada
                await productoDB.save();
                console.log(`Producto ${productoDB.nombre} actualizado con nueva cantidad: ${productoDB.cantidad}`);
            } else {
                // Manejo de errores si no se encuentra el producto
                console.error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
            }
        }

        res.status(200).json({ message: 'Venta anulada correctamente y productos devueltos al inventario.' });
    } catch (error) {
        console.error('Error al anular la venta:', error);
        res.status(500).json({ message: 'Error al anular la venta.', error: error.message });
    }
};
