const Compra = require('../models/Compra');
const Producto = require('../models/ProductoServicio');

// Función para actualizar el stock de productos
const updateStock = async (productos_servicios, agregar) => {
    for (const producto of productos_servicios) {
        const productoDB = await Producto.findById(producto.producto_servicio_id);
        if (productoDB) {
            productoDB.cantidad += agregar ? parseInt(producto.cantidad, 10) : -parseInt(producto.cantidad, 10); // Ajustar stock
            if (productoDB.cantidad < 0) {
                throw new Error(`Cantidad insuficiente en el inventario para el producto: ${productoDB.nombre}`);
            }
            await productoDB.save();
        } else {
            throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
        }
    }
};

// Crear nueva compra
exports.createCompra = async (req, res) => {
    try {
        const { proveedor, fecha, estado, productos_servicios } = req.body;

        if (!proveedor || !fecha || !productos_servicios.length) {
            return res.status(400).json({ message: 'Datos de compra incompletos' });
        }

        const total = productos_servicios.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        const compra = new Compra({
            proveedor,
            fecha,
            estado: estado || 'completado',
            productos_servicios,
            total
        });

        const nuevaCompra = await compra.save();

        // Actualizar el stock si el estado es 'completado'
        if (nuevaCompra.estado === 'completado') {
            await updateStock(productos_servicios, true); // Sumar stock
        }

        res.status(201).json(nuevaCompra);
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar compra
exports.updateCompra = async (req, res) => {
    try {
        const compraId = req.params.id;
        const { proveedor, fecha, estado, productos_servicios } = req.body;

        const compra = await Compra.findById(compraId);
        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }

        // Ajustar el stock según el estado anterior
        if (compra.estado === 'completado') {
            await updateStock(compra.productos_servicios, false); // Restar stock al cancelar
        }

        const total = productos_servicios.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        compra.proveedor = proveedor;
        compra.fecha = fecha;
        compra.estado = estado;
        compra.productos_servicios = productos_servicios;
        compra.total = total;

        // Ajustar el stock según el nuevo estado
        if (estado === 'completado') {
            await updateStock(productos_servicios, true); // Sumar stock
        }

        await compra.save();
        res.status(200).json(compra);
    } catch (error) {
        console.error('Error al actualizar la compra:', error);
        res.status(400).json({ error: error.message });
    }
};

// Eliminar compra
exports.deleteCompra = async (req, res) => {
    try {
        const compra = await Compra.findByIdAndDelete(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.status(200).json({ message: 'Compra eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
