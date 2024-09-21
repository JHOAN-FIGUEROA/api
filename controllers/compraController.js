const Compra = require('../models/Compra');
const Producto = require('../models/ProductoServicio');

// Función para obtener el siguiente _id disponible para una compra
const getNextCompraId = async () => {
    try {
        const lastCompra = await Compra.findOne().sort({ _id: -1 }).exec();
        if (lastCompra) {
            const lastId = parseInt(lastCompra._id.replace('compra_', ''), 10);
            const nextId = lastId + 1;
            return `compra_${nextId.toString().padStart(3, '0')}`;
        }
        return 'compra_001';
    } catch (error) {
        throw new Error('Error al obtener el siguiente ID de compra');
    }
};

// Obtener todas las compras
exports.getCompras = async (req, res) => {
    try {
        const compras = await Compra.find();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las compras', error: error.message });
    }
};

// Obtener una compra por ID
exports.getCompraById = async (req, res) => {
    try {
        const compra = await Compra.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la compra', error: error.message });
    }
};

// Crear una nueva compra
exports.createCompra = async (req, res) => {
    try {
        const { proveedor, fecha, estado, productos_servicios, total } = req.body;

        // Crear la compra
        const newCompra = new Compra({
            proveedor,
            fecha,
            estado,
            productos_servicios,
            total,
        });

        // Si la compra está en estado 'completada', actualizamos las cantidades del inventario
        if (estado === 'completada') {
            for (let item of productos_servicios) {
                const producto = await Producto.findById(item.producto_servicio_id);

                if (!producto) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                // Sumar la cantidad comprada al inventario
                producto.cantidad += item.cantidad;

                // Guardar el producto con la cantidad actualizada
                await producto.save();
            }
        }

        // Guardar la compra
        await newCompra.save();

        res.status(201).json(newCompra);
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una compra
exports.updateCompra = async (req, res) => {
    try {
        const compraId = req.params.id;
        const { proveedor, fecha, estado, productos_servicios, total } = req.body;

        const compra = await Compra.findById(compraId);
        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }

        // Si la compra estaba en estado 'completada' antes de actualizar
        if (compra.estado === 'completada') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    // Si la compra estaba completada, devolvemos la cantidad previa al inventario
                    productoDB.cantidad -= producto.cantidad;
                    await productoDB.save();
                }
            }
        }

        // Si la nueva compra es 'completada', sumamos los productos comprados al inventario
        if (estado === 'completada') {
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    // Sumar la nueva cantidad comprada al inventario
                    productoDB.cantidad += producto.cantidad;
                    await productoDB.save();
                }
            }
        }

        compra.proveedor = proveedor;
        compra.fecha = fecha;
        compra.estado = estado;
        compra.productos_servicios = productos_servicios;
        compra.total = total;

        await compra.save();

        res.status(200).json(compra);
    } catch (error) {
        console.error('Error al actualizar la compra:', error);
        res.status(400).json({ error: error.message });
    }
};

// Anular una compra
exports.deleteCompra = async (req, res) => {
    try {
        const compra = await Compra.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        // Cambiar el estado a 'cancelada'
        compra.estado = 'cancelada';
        await compra.save();

        // Devolver productos al inventario
        for (const producto of compra.productos_servicios) {
            const productoDB = await Producto.findById(producto.producto_servicio_id);

            if (productoDB) {
                // Restar la cantidad comprada del inventario
                productoDB.cantidad -= producto.cantidad;

                // Guardar el producto con la cantidad actualizada
                await productoDB.save();
            } else {
                // Manejo de errores si no se encuentra el producto
                console.error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
            }
        }

        res.status(200).json({ message: 'Compra anulada correctamente y productos devueltos al inventario.' });
    } catch (error) {
        console.error('Error al anular la compra:', error);
        res.status(500).json({ message: 'Error al anular la compra.', error: error.message });
    }
};
