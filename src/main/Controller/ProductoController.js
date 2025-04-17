import db from "../DB/conexion";

export function insertarProducto(producto) {

    try {
        const stmt = db.prepare(`
      INSERT INTO producto (nombre, descripcion, precio_compra, precio_venta, cantidad_Stock)
      VALUES (?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            producto.nombre,
            producto.descripcion,
            producto.precioCompra,
            producto.precioVenta,
            producto.cantidadStock,

        );

        return { success: true, id: info.lastInsertRowid };
    } catch (error) {
        console.error('Error al insertar producto:', error);
        return { success: false, error: error.message };
    }

}

// module.exports = setupIPCHandlers;
