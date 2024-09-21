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
        const { proveedor, fecha, estado, total, productos_servicios,total } = req.body;

        // Validar que el proveedor y otros campos estén presentes
        if (!proveedor || !fecha || !productos_servicios.length) {
            return res.status(400).json({ message: 'Datos de compra incompletos' });
        }

        // Crear la nueva compra
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
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad += parseInt(producto.cantidad, 10); // Restar del stock
                    await productoDB.save();
                } else {
                    return res.status(400).json({ message: `Producto no encontrado: ${producto.producto_servicio_id}` });
                }
            }
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
        if (compra.estado === 'cancelado') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad -= producto.cantidad; // Reponer stock
                    await productoDB.save();
                }
            }
        }

        // Actualiza los datos de la compra
        compra.proveedor = proveedor;
        compra.fecha = fecha;
        compra.estado = estado;
        compra.productos_servicios = productos_servicios;

        // Ajustar el stock según el nuevo estado
        if (estado === 'cancelado') {
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad -= producto.cantidad; // Restar del stock
                    await productoDB.save();
                } else {
                    return res.status(400).json({ message: `Producto no encontrado: ${producto.producto_servicio_id}` });
                }
            }
        } else if (estado === 'cancelado') {
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad -= producto.cantidad; // Reponer stock si se cancela
                    await productoDB.save();
                }
            }
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

