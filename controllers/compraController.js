const Compra = require('../models/Compra');
const Producto = require('../models/ProductoServicio');

// Función para obtener el siguiente _id disponible
const getNextCompraId = async () => {
    try {
        const lastCompra = await Compra.findOne().sort({ _id: -1 }).exec();
        if (lastCompra) {
            const lastId = parseInt(lastCompra._id.replace('compra_', ''), 10);
            if (!isNaN(lastId)) {
                const nextId = lastId + 1;
                return `compra_${nextId.toString().padStart(3, '0')}`;
            } else {
                return 'compra_001';
            }
        } else {
            return 'compra_001';
        }
    } catch (error) {
        console.error('Error al obtener el siguiente ID de compra:', error);
        throw new Error('Error al obtener el siguiente ID de compra');
    }
};

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
        const { proveedor, fecha, total, estado, productos_servicios } = req.body;

        // Validar que el proveedor y otros campos estén presentes
        if (!proveedor || !fecha || !total || !productos_servicios.length) {
            return res.status(400).json({ message: 'Datos de compra incompletos' });
        }

        // Crear la nueva compra
        const compra = new Compra({
            proveedor,
            fecha,
            total,
            estado: estado || 'completado',
            productos_servicios
        });

        const nuevaCompra = await compra.save();

        // Actualizar el stock si el estado es 'completado'
        if (compra.estado === 'completado') {
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad += parseInt(producto.cantidad, 10); // Convertir cantidad a entero
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
        const compra = await Compra.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        const estadoAnterior = compra.estado;
        const nuevoEstado = req.body.estado;

        // Actualiza los datos de la compra
        Object.assign(compra, req.body);
        await compra.save();

        // Si la compra estaba "completada" y ahora está "cancelada", revertir el stock
        if (estadoAnterior === 'completado' && nuevoEstado === 'cancelado') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    // Asegurarse de que la cantidad sea un número válido
                    const cantidadADescontar = parseInt(producto.cantidad, 10);
                    if (!isNaN(cantidadADescontar)) {
                        productoDB.cantidad -= cantidadADescontar; // Resta el stock
                        await productoDB.save();
                    } else {
                        return res.status(400).json({ message: `Cantidad inválida para el producto: ${producto.producto_servicio_id}` });
                    }
                } else {
                    throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                }
            }
        }

        // Si la compra estaba "pendiente" o "cancelada" y ahora está "completada", actualizar el stock
        else if ((estadoAnterior === 'pendiente' || estadoAnterior === 'cancelado') && nuevoEstado === 'completado') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    const cantidadAAgregar = parseInt(producto.cantidad, 10);
                    if (!isNaN(cantidadAAgregar)) {
                        productoDB.cantidad += cantidadAAgregar; // Suma el stock
                        await productoDB.save();
                    } else {
                        return res.status(400).json({ message: `Cantidad inválida para el producto: ${producto.producto_servicio_id}` });
                    }
                } else {
                    throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                }
            }
        }

        res.status(200).json(compra);
    } catch (error) {
        console.error('Error al actualizar la compra:', error);
        res.status(400).json({ message: error.message });
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
