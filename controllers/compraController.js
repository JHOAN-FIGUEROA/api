const Compra = require('../models/Compra');
const Producto = require('../models/ProductoServicio');

// Obtener todas las compras
exports.getCompras = async (req, res) => {
    try {
        const compras = await Compra.find();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener compra por ID
exports.getCompraById = async (req, res) => {
    try {
        const compra = await Compra.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear nueva compra
exports.createCompra = async (req, res) => {
    try {
        const { proveedor, fecha, estado, productos_servicios,total } = req.body;

        // Crear la nueva compra
        const compra = new Compra({
            proveedor,
            fecha,
            estado: estado || 'completado',
            productos_servicios,
            total,
        });

        const nuevaCompra = await compra.save();

        // Actualizar el stock según el estado de la compra
        await updateStock(productos_servicios, nuevaCompra.estado === 'completado');

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
        await updateStock(compra.productos_servicios, compra.estado === 'completado', true);

        // Actualiza los datos de la compra
        compra.proveedor = proveedor;
        compra.fecha = fecha;
        compra.estado = estado;
        compra.productos_servicios = productos_servicios;

        // Ajustar el stock según el nuevo estado
        await updateStock(productos_servicios, estado === 'completado');

        await compra.save();

        res.status(200).json(compra);
    } catch (error) {
        console.error('Error al actualizar la compra:', error);
        res.status(400).json({ error: error.message });
    }
};

// Función para actualizar el stock de productos
const updateStock = async (productos_servicios, esSumar, esRevertir = false) => {
    for (const producto of productos_servicios) {
        const productoDB = await Producto.findById(producto.producto_servicio_id);
        if (productoDB) {
            if (esRevertir) {
                // Revertir el stock anterior
                productoDB.cantidad += esSumar ? producto.cantidad : -producto.cantidad;
            } else {
                // Actualizar el stock nuevo
                productoDB.cantidad += esSumar ? producto.cantidad : -producto.cantidad;
            }
            await productoDB.save();
        } else {
            throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
        }
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
