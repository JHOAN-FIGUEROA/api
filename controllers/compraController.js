const Compra = require('../models/Compra');
const Producto = require('../models/ProductoServicio');

// Función para obtener el siguiente _id disponible
const getNextCompraId = async () => {
    try {
        // Obtiene la última compra ordenada por _id descendente
        const lastCompra = await Compra.findOne().sort({ _id: -1 }).exec();
        
        if (lastCompra) {
            // Verifica si el _id tiene el formato esperado antes de intentar hacer un replace
            const lastId = parseInt(lastCompra._id.replace('compra_', ''), 10);
            if (!isNaN(lastId)) {
                const nextId = lastId + 1;
                return `compra_${nextId.toString().padStart(3, '0')}`;
            } else {
                // Si no tiene el formato esperado, genera el primer ID de la serie
                return 'compra_001';
            }
        } else {
            // Si no hay compras, regresa el primer ID
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

        

        const compra = new Compra({
            
            proveedor,
            fecha,
            total,
            estado: estado || 'completado',
            productos_servicios
        });

        const nuevaCompra = await compra.save();
        res.status(201).json(nuevaCompra);
    } catch (error) {
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

        Object.assign(compra, req.body);
        await compra.save();

        if (estadoAnterior === 'completado' && nuevoEstado === 'cancelado') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad -= producto.cantidad;
                    await productoDB.save();
                } else {
                    throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                }
            }
        } else if ((estadoAnterior === 'pendiente' || estadoAnterior === 'cancelado') && nuevoEstado === 'completado') {
            for (const producto of compra.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad += producto.cantidad;
                    if (productoDB.cantidad < 0) {
                        return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto.producto_servicio_id}` });
                    }
                    await productoDB.save();
                } else {
                    throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                }
            }
        }

        res.status(200).json(compra);
    } catch (error) {
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

