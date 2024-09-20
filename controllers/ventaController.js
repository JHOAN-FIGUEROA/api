const Venta = require('../models/Venta');
const Producto = require('../models/ProductoServicio');

// Función para obtener el siguiente _id disponible para una venta
const getNextVentaId = async () => {
    try {
        const lastVenta = await Venta.findOne().sort({ _id: -1 }).exec();
        if (lastVenta) {
            const lastId = parseInt(lastVenta._id.replace('venta_', ''));
            const nextId = lastId + 1;
            return `venta_${nextId.toString().padStart(3, '0')}`;
        }
        return 'venta_001';
    } catch (error) {
        throw new Error('Error al obtener el siguiente ID de venta');
    }
};

// Trae la lista completa de las ventas de la base de datos.
exports.getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
};

// Busca una venta en la base de datos utilizando el ID proporcionado.
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

// Crea una nueva venta en la base de datos.
exports.createVenta = async (req, res) => {
    try {
        const { cliente, fecha, total, estado = 'completada', productos_servicios } = req.body;

        // Validar productos
        for (const producto of productos_servicios) {
            const productoDB = await Producto.findById(producto.producto_servicio_id);
            if (!productoDB) {
                return res.status(400).json({ message: `Producto no encontrado: ${producto.producto_servicio_id}` });
            }
        }

        const nextId = await getNextVentaId();
        const venta = new Venta({ cliente, fecha, total, estado, productos_servicios });
        const nuevaVenta = await venta.save();

        // Actualizar stock de productos solo si el estado es "completada"
        if (estado === 'completada') {
            for (const producto of productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                productoDB.cantidad -= producto.cantidad;
                if (productoDB.cantidad < 0) {
                    return res.status(400).json({ message: `Stock insuficiente para el producto: ${producto.producto_servicio_id}` });
                }
                await productoDB.save();
            }
        }

        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la venta', error: error.message });
    }
};

// Actualiza la información de una venta existente en la base de datos utilizando su ID.
exports.updateVenta = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        const estadoAnterior = venta.estado;
        const nuevoEstado = req.body.estado;

        // Actualiza los datos de la venta
        Object.assign(venta, req.body);
        await venta.save();

        // Manejo de stock según el cambio de estado
        const actualizarStock = async (cambio) => {
            for (const producto of venta.productos_servicios) {
                const productoDB = await Producto.findById(producto.producto_servicio_id);
                if (productoDB) {
                    productoDB.cantidad += cambio * producto.cantidad; // Ajustar cantidad según el cambio
                    await productoDB.save();
                } else {
                    throw new Error(`Producto no encontrado: ${producto.producto_servicio_id}`);
                }
            }
        };

        if (estadoAnterior === 'completada' && nuevoEstado === 'cancelada') {
            await actualizarStock(1); // Devolver stock
        } else if (estadoAnterior === 'cancelada' && nuevoEstado === 'completada') {
            await actualizarStock(-1); // Quitar stock
        }

        res.status(200).json(venta);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la venta', error: error.message });
    }
};

