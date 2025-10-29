import db from "../DB/conexion";

// Función helper para verificar y agregar columna cliente_id si no existe
function verificarYAgregarClienteId() {
    try {
        const checkColumn = db.prepare(`PRAGMA table_info(venta)`).all();
        const hasClienteId = checkColumn.some(col => col.name === 'cliente_id');

        if (!hasClienteId) {
            console.log('Agregando columna cliente_id a tabla venta...');
            db.exec(`ALTER TABLE venta ADD COLUMN cliente_id INTEGER;`);
            console.log('✓ Columna cliente_id agregada exitosamente');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al verificar/agregar cliente_id:', error);
        return false;
    }
}

export function insertarVenta(venta) {
    // Tabla venta:
    // idVenta INTEGER PRIMARY KEY AUTOINCREMENT,
    // cliente_id INTEGER (puede ser NULL para venta sin cliente registrado),
    // fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    // total REAL NOT NULL

    // Tabla detalle_ventas:
    // id INTEGER PRIMARY KEY AUTOINCREMENT,
    // venta_id INTEGER NOT NULL,
    // producto_id INTEGER NOT NULL,
    // cantidad INTEGER NOT NULL,
    // precio_unitario REAL NOT NULL,
    // subtotal REAL NOT NULL

    console.log("Insertando venta");
    console.log("Data:", venta);

    // Asegurar que la columna cliente_id existe
    verificarYAgregarClienteId();

    const transaction = db.transaction(() => {
        try {
            // Verificar si la tabla venta tiene la columna cliente_id
            const checkColumnStmt = db.prepare(`PRAGMA table_info(venta)`);
            const columns = checkColumnStmt.all();
            const hasClienteId = columns.some(col => col.name === 'cliente_id');

            // Insertar la venta principal
            let stmtVenta;
            let infoVenta;

            if (hasClienteId) {
                stmtVenta = db.prepare(`
                    INSERT INTO venta (cliente_id, fecha, total)
                    VALUES (?, ?, ?)
                `);
                infoVenta = stmtVenta.run(
                    venta.cliente_id || null,
                    venta.fecha,
                    venta.total
                );
            } else {
                // Si no existe la columna, insertar sin cliente_id
                stmtVenta = db.prepare(`
                    INSERT INTO venta (fecha, total)
                    VALUES (?, ?)
                `);
                infoVenta = stmtVenta.run(
                    venta.fecha,
                    venta.total
                );
            }

            const ventaId = infoVenta.lastInsertRowid;

            // Insertar los detalles de la venta y actualizar stock
            if (venta.detalles && venta.detalles.length > 0) {
                const stmtDetalle = db.prepare(`
                    INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const stmtActualizarStock = db.prepare(`
                    UPDATE producto
                    SET cantidad_Stock = cantidad_Stock - ?
                    WHERE id = ?
                `);

                const stmtVerificarStock = db.prepare(`
                    SELECT cantidad_Stock FROM producto WHERE id = ?
                `);

                for (const detalle of venta.detalles) {
                    // Verificar que hay stock suficiente
                    const producto = stmtVerificarStock.get(detalle.producto_id);
                    if (!producto) {
                        throw new Error(`Producto con ID ${detalle.producto_id} no encontrado`);
                    }
                    if (producto.cantidad_Stock < detalle.cantidad) {
                        throw new Error(`Stock insuficiente para el producto ID ${detalle.producto_id}. Stock disponible: ${producto.cantidad_Stock}, solicitado: ${detalle.cantidad}`);
                    }

                    // Insertar detalle de venta
                    stmtDetalle.run(
                        ventaId,
                        detalle.producto_id,
                        detalle.cantidad,
                        detalle.precio_unitario,
                        detalle.subtotal
                    );

                    // Disminuir el stock del producto
                    stmtActualizarStock.run(
                        detalle.cantidad,
                        detalle.producto_id
                    );
                }
            }

            return { success: true, id: ventaId };
        } catch (error) {
            console.error('Error al insertar venta:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacción de venta:', error);
        return { success: false, error: error.message };
    }
}

// Ejemplo de uso:
// insertarVenta({
//   "fecha": "2024-01-15",
//   "total": 125.50,
//   "detalles": [
//     {
//       "producto_id": 1,
//       "cantidad": 2,
//       "precio_unitario": 50.00,
//       "subtotal": 100.00
//     },
//     {
//       "producto_id": 2,
//       "cantidad": 1,
//       "precio_unitario": 25.50,
//       "subtotal": 25.50
//     }
//   ]
// })

export function listarVentas(fechaDesde = null, fechaHasta = null) {
    try {
        // // Asegurar que la columna cliente_id existe
        // verificarYAgregarClienteId();

        // // Verificar si la tabla venta tiene la columna cliente_id
        // const checkColumnStmt = db.prepare(`PRAGMA table_info(venta)`);
        // const columns = checkColumnStmt.all();
        // const hasClienteId = columns.some(col => col.name === 'cliente_id');

        // Construir SQL base
        let sql = `
            SELECT
                v.idVenta as "id",
                v.cliente_id,
                c.nombre as "cliente_nombre",
                v.fecha,
                v.total
            FROM venta v
            LEFT JOIN Cliente c ON v.cliente_id = c.idCliente
        `;

        // Agregar filtros de fecha si se proporcionan
        const whereConditions = [];
        const params = [];

        if (fechaDesde) {
            whereConditions.push(`DATE(v.fecha) >= ?`);
            params.push(fechaDesde);
        }

        if (fechaHasta) {
            whereConditions.push(`DATE(v.fecha) <= ?`);
            params.push(fechaHasta);
        }

        if (whereConditions.length > 0) {
            sql += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        sql += ` ORDER BY v.fecha DESC`;

        console.log("Ejecutando SQL:", sql, "con parámetros:", params);
        const stmt = db.prepare(sql);
        const ventas = stmt.all(...params);

        console.log("Ventas obtenidas:", ventas);
        console.log("Filtros aplicados - Desde:", fechaDesde, "Hasta:", fechaHasta);

        return { success: true, data: ventas };
    } catch (error) {
        console.error('Error al listar ventas:', error);
        return { success: false, error: error.message };
    }
}

export function obtenerDetallesVenta(ventaId) {
    try {
        const stmt = db.prepare(`
            SELECT
                dv.id,
                dv.producto_id,
                pr.nombre as "producto_nombre",
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
            FROM detalle_ventas dv
            LEFT JOIN producto pr ON dv.producto_id = pr.id
            WHERE dv.venta_id = ?
        `);

        const detalles = stmt.all(ventaId);
        console.log("Detalles de venta:", detalles);

        return { success: true, data: detalles };
    } catch (error) {
        console.error('Error al obtener detalles de venta:', error);
        return { success: false, error: error.message };
    }
}

export function eliminarVenta(id) {
    const transaction = db.transaction(() => {
        try {
            // Primero obtener los detalles para revertir el stock
            const stmtObtenerDetalles = db.prepare(`
                SELECT producto_id, cantidad
                FROM detalle_ventas
                WHERE venta_id = ?
            `);
            const detalles = stmtObtenerDetalles.all(id);

            // Revertir el stock de cada producto (devolver el stock)
            const stmtRevertirStock = db.prepare(`
                UPDATE producto
                SET cantidad_Stock = cantidad_Stock + ?
                WHERE id = ?
            `);

            for (const detalle of detalles) {
                stmtRevertirStock.run(
                    detalle.cantidad,
                    detalle.producto_id
                );
            }

            // Eliminar los detalles
            const stmtDetalles = db.prepare(`DELETE FROM detalle_ventas WHERE venta_id = ?`);
            const resultDetalles = stmtDetalles.run(id);

            // Luego eliminar la venta principal
            const stmtVenta = db.prepare(`DELETE FROM venta WHERE idVenta = ?`);
            const resultVenta = stmtVenta.run(id);

            return {
                success: true,
                changes: resultVenta.changes,
                detallesEliminados: resultDetalles.changes
            };
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacción de eliminación:', error);
        return { success: false, error: error.message };
    }
}

export function actualizarVenta(venta) {
    const transaction = db.transaction(() => {
        try {
            // Primero obtener los detalles antiguos para revertir el stock
            const stmtObtenerDetallesAntiguos = db.prepare(`
                SELECT producto_id, cantidad
                FROM detalle_ventas
                WHERE venta_id = ?
            `);
            const detallesAntiguos = stmtObtenerDetallesAntiguos.all(venta.id);

            // Revertir el stock de los detalles antiguos (devolver el stock)
            const stmtRevertirStock = db.prepare(`
                UPDATE producto
                SET cantidad_Stock = cantidad_Stock + ?
                WHERE id = ?
            `);

            for (const detalle of detallesAntiguos) {
                stmtRevertirStock.run(
                    detalle.cantidad,
                    detalle.producto_id
                );
            }

            // Verificar si la tabla venta tiene la columna cliente_id
            const checkColumnStmt = db.prepare(`PRAGMA table_info(venta)`);
            const columns = checkColumnStmt.all();
            const hasClienteId = columns.some(col => col.name === 'cliente_id');

            // Actualizar la venta principal
            let stmtVenta;
            let resultVenta;

            if (hasClienteId) {
                stmtVenta = db.prepare(`
                    UPDATE venta
                    SET cliente_id = ?, fecha = ?, total = ?
                    WHERE idVenta = ?
                `);
                resultVenta = stmtVenta.run(
                    venta.cliente_id || null,
                    venta.fecha,
                    venta.total,
                    venta.id
                );
            } else {
                stmtVenta = db.prepare(`
                    UPDATE venta
                    SET fecha = ?, total = ?
                    WHERE idVenta = ?
                `);
                resultVenta = stmtVenta.run(
                    venta.fecha,
                    venta.total,
                    venta.id
                );
            }

            // Eliminar detalles existentes
            const stmtEliminarDetalles = db.prepare(`DELETE FROM detalle_ventas WHERE venta_id = ?`);
            stmtEliminarDetalles.run(venta.id);

            // Insertar nuevos detalles y actualizar stock
            if (venta.detalles && venta.detalles.length > 0) {
                const stmtDetalle = db.prepare(`
                    INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const stmtActualizarStock = db.prepare(`
                    UPDATE producto
                    SET cantidad_Stock = cantidad_Stock - ?
                    WHERE id = ?
                `);

                const stmtVerificarStock = db.prepare(`
                    SELECT cantidad_Stock FROM producto WHERE id = ?
                `);

                for (const detalle of venta.detalles) {
                    // Verificar que hay stock suficiente
                    const producto = stmtVerificarStock.get(detalle.producto_id);
                    if (!producto) {
                        throw new Error(`Producto con ID ${detalle.producto_id} no encontrado`);
                    }
                    if (producto.cantidad_Stock < detalle.cantidad) {
                        throw new Error(`Stock insuficiente para el producto ID ${detalle.producto_id}. Stock disponible: ${producto.cantidad_Stock}, solicitado: ${detalle.cantidad}`);
                    }

                    // Insertar nuevo detalle
                    stmtDetalle.run(
                        venta.id,
                        detalle.producto_id,
                        detalle.cantidad,
                        detalle.precio_unitario,
                        detalle.subtotal
                    );

                    // Disminuir el stock con la nueva cantidad
                    stmtActualizarStock.run(
                        detalle.cantidad,
                        detalle.producto_id
                    );
                }
            }

            return { success: true, changes: resultVenta.changes };
        } catch (error) {
            console.error('Error al actualizar venta:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacción de actualización:', error);
        return { success: false, error: error.message };
    }
}

// Función auxiliar para obtener productos con stock disponible
export function listarProductosConStock() {
    try {
        const stmt = db.prepare(`
            SELECT
                id,
                nombre,
                precio_venta as "precio",
                cantidad_Stock as "stock"
            FROM producto
            WHERE cantidad_Stock > 0
            ORDER BY nombre
        `);

        const productos = stmt.all();
        return { success: true, data: productos };
    } catch (error) {
        console.error('Error al listar productos con stock:', error);
        return { success: false, error: error.message };
    }
}

// Función para obtener todos los productos (incluso sin stock, para mostrar información)
export function listarTodosProductosVenta() {
    try {
        const stmt = db.prepare(`
            SELECT
                id,
                nombre,
                precio_venta as "precio",
                cantidad_Stock as "stock"
            FROM producto
            ORDER BY nombre
        `);

        const productos = stmt.all();
        return { success: true, data: productos };
    } catch (error) {
        console.error('Error al listar productos:', error);
        return { success: false, error: error.message };
    }
}

// Función auxiliar para obtener clientes (para dropdowns)
export function listarClientesVenta() {
    try {
        const stmt = db.prepare(`
            SELECT idCliente as "id", nombre, telefono, direccion
            FROM Cliente
            ORDER BY nombre
        `);

        const clientes = stmt.all();
        return { success: true, data: clientes };
    } catch (error) {
        console.error('Error al listar clientes:', error);
        return { success: false, error: error.message };
    }
}
