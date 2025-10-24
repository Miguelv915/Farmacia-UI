import db from "../DB/conexion";

export function insertarCompra(compra) {
    // Tabla compras:
    // idcompras INTEGER PRIMARY KEY AUTOINCREMENT,
    // proveedor_id INTEGER NOT NULL,
    // fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    // total REAL NOT NULL

    // Tabla detalle_compras:
    // idDetalle_compras INTEGER PRIMARY KEY AUTOINCREMENT,
    // compra_id INTEGER NOT NULL,
    // producto_id INTEGER NOT NULL,
    // cantidad INTEGER NOT NULL,
    // precio_compra REAL NOT NULL,
    // subtotal REAL NOT NULL

    console.log("Insertando compra");
    console.log("Data:", compra);

    const transaction = db.transaction(() => {
        try {
            // Insertar la compra principal
            const stmtCompra = db.prepare(`
                INSERT INTO compras (proveedor_id, fecha, total)
                VALUES (?, ?, ?)
            `);

            const infoCompra = stmtCompra.run(
                compra.proveedor_id,
                compra.fecha,
                compra.total
            );

            const compraId = infoCompra.lastInsertRowid;

            // Insertar los detalles de la compra y actualizar stock
            if (compra.detalles && compra.detalles.length > 0) {
                const stmtDetalle = db.prepare(`
                    INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_compra, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const stmtActualizarStock = db.prepare(`
                    UPDATE producto
                    SET cantidad_Stock = cantidad_Stock + ?
                    WHERE id = ?
                `);

                for (const detalle of compra.detalles) {
                    // Insertar detalle de compra
                    stmtDetalle.run(
                        compraId,
                        detalle.producto_id,
                        detalle.cantidad,
                        detalle.precio_compra,
                        detalle.subtotal
                    );

                    // Incrementar el stock del producto
                    stmtActualizarStock.run(
                        detalle.cantidad,
                        detalle.producto_id
                    );
                }
            }

            return { success: true, id: compraId };
        } catch (error) {
            console.error('Error al insertar compra:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacci�n de compra:', error);
        return { success: false, error: error.message };
    }
}

// insertarCompra({
//   "proveedor_id": 1,
//   "fecha": "2024-01-15",
//   "total": 150.75,
//   "detalles": [
//     {
//       "producto_id": 1,
//       "cantidad": 2,
//       "precio_compra": 25.50,
//       "subtotal": 51.00
//     },
//     {
//       "producto_id": 2,
//       "cantidad": 1,
//       "precio_compra": 99.75,
//       "subtotal": 99.75
//     }
//   ]
// })

export function listarCompras() {
    try {
        const stmt = db.prepare(`
            SELECT
                c.idcompras as "id",
                c.proveedor_id,
                p.nombre as "proveedor_nombre",
                c.fecha,
                c.total
            FROM compras c
            LEFT JOIN Proveedor p ON c.proveedor_id = p.idProveedor
            ORDER BY c.fecha DESC
        `);

        const compras = stmt.all();
        console.log("Compras obtenidas:", compras);

        return { success: true, data: compras };
    } catch (error) {
        console.error('Error al listar compras:', error);
        return { success: false, error: error.message };
    }
}

export function obtenerDetallesCompra(compraId) {
    try {
        const stmt = db.prepare(`
            SELECT
                dc.idDetalle_compras as "id",
                dc.producto_id,
                pr.nombre as "producto_nombre",
                dc.cantidad,
                dc.precio_compra,
                dc.subtotal
            FROM detalle_compras dc
            LEFT JOIN producto pr ON dc.producto_id = pr.id
            WHERE dc.compra_id = ?
        `);

        const detalles = stmt.all(compraId);
        console.log("Detalles de compra:", detalles);

        return { success: true, data: detalles };
    } catch (error) {
        console.error('Error al obtener detalles de compra:', error);
        return { success: false, error: error.message };
    }
}

export function eliminarCompra(id) {
    const transaction = db.transaction(() => {
        try {
            // Primero obtener los detalles para revertir el stock
            const stmtObtenerDetalles = db.prepare(`
                SELECT producto_id, cantidad
                FROM detalle_compras
                WHERE compra_id = ?
            `);
            const detalles = stmtObtenerDetalles.all(id);

            // Revertir el stock de cada producto
            const stmtRevertirStock = db.prepare(`
                UPDATE producto
                SET cantidad_Stock = cantidad_Stock - ?
                WHERE id = ?
            `);

            for (const detalle of detalles) {
                stmtRevertirStock.run(
                    detalle.cantidad,
                    detalle.producto_id
                );
            }

            // Eliminar los detalles
            const stmtDetalles = db.prepare(`DELETE FROM detalle_compras WHERE compra_id = ?`);
            const resultDetalles = stmtDetalles.run(id);

            // Luego eliminar la compra principal
            const stmtCompra = db.prepare(`DELETE FROM compras WHERE idcompras = ?`);
            const resultCompra = stmtCompra.run(id);

            return {
                success: true,
                changes: resultCompra.changes,
                detallesEliminados: resultDetalles.changes
            };
        } catch (error) {
            console.error('Error al eliminar compra:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacci�n de eliminaci�n:', error);
        return { success: false, error: error.message };
    }
}

export function actualizarCompra(compra) {
    const transaction = db.transaction(() => {
        try {
            // Primero obtener los detalles antiguos para revertir el stock
            const stmtObtenerDetallesAntiguos = db.prepare(`
                SELECT producto_id, cantidad
                FROM detalle_compras
                WHERE compra_id = ?
            `);
            const detallesAntiguos = stmtObtenerDetallesAntiguos.all(compra.id);

            // Revertir el stock de los detalles antiguos
            const stmtRevertirStock = db.prepare(`
                UPDATE producto
                SET cantidad_Stock = cantidad_Stock - ?
                WHERE id = ?
            `);

            for (const detalle of detallesAntiguos) {
                stmtRevertirStock.run(
                    detalle.cantidad,
                    detalle.producto_id
                );
            }

            // Actualizar la compra principal
            const stmtCompra = db.prepare(`
                UPDATE compras
                SET proveedor_id = ?, fecha = ?, total = ?
                WHERE idcompras = ?
            `);

            const resultCompra = stmtCompra.run(
                compra.proveedor_id,
                compra.fecha,
                compra.total,
                compra.id
            );

            // Eliminar detalles existentes
            const stmtEliminarDetalles = db.prepare(`DELETE FROM detalle_compras WHERE compra_id = ?`);
            stmtEliminarDetalles.run(compra.id);

            // Insertar nuevos detalles y actualizar stock
            if (compra.detalles && compra.detalles.length > 0) {
                const stmtDetalle = db.prepare(`
                    INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_compra, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const stmtActualizarStock = db.prepare(`
                    UPDATE producto
                    SET cantidad_Stock = cantidad_Stock + ?
                    WHERE id = ?
                `);

                for (const detalle of compra.detalles) {
                    // Insertar nuevo detalle
                    stmtDetalle.run(
                        compra.id,
                        detalle.producto_id,
                        detalle.cantidad,
                        detalle.precio_compra,
                        detalle.subtotal
                    );

                    // Incrementar el stock con la nueva cantidad
                    stmtActualizarStock.run(
                        detalle.cantidad,
                        detalle.producto_id
                    );
                }
            }

            return { success: true, changes: resultCompra.changes };
        } catch (error) {
            console.error('Error al actualizar compra:', error);
            throw error;
        }
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error en transacci�n de actualizaci�n:', error);
        return { success: false, error: error.message };
    }
}

// Funci�n auxiliar para obtener proveedores (para dropdowns)
export function listarProveedores() {
    try {
        const stmt = db.prepare(`
            SELECT idProveedor as "id", nombre
            FROM Proveedor
            ORDER BY nombre
        `);

        const proveedores = stmt.all();
        return { success: true, data: proveedores };
    } catch (error) {
        console.error('Error al listar proveedores:', error);
        return { success: false, error: error.message };
    }
}

// Funci�n auxiliar para obtener productos (para dropdowns)
export function listarProductos() {
    try {
        const stmt = db.prepare(`
            SELECT id, nombre, precio_venta as "precio"
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