import db from "../DB/conexion";

export function insertarProveedor(proveedor) {

    // idProveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    // nombre TEXT,
    // direccion TEXT,
    // telefono TEXT
    console.log("Insertando proveedor");
    
    console.log("Data:", proveedor);

    try {
        const stmt = db.prepare(`
      INSERT INTO proveedor (nombre, direccion, telefono)
      VALUES (?, ?, ?)
    `);

        const info = stmt.run(
            proveedor.nombre,
            proveedor.direccion,
            proveedor.telefono,
            // proveedor.precioVenta,
            // proveedor.cantidadStock,

        );

        return { success: true, id: info.lastInsertRowid };
    } catch (error) {
        console.error('Error al insertar proveedor:', error);
        return { success: false, error: error.message };
    }

}

// insertarProveedor ({"nombre":"IDUCTRIAS","direccion":"direcion de piura peru","telefono":"987456321" })

// listarProveedor()
export function listarProveedor() {
    try {
        const stmt = db.prepare(`
        SELECT idProveedor as "id", nombre, direccion, telefono
        FROM proveedor
      `);

        const productos = stmt.all(); // Retorna todos los resultados en un array
        console.log("::", productos);

        return { success: true, data: productos };
    } catch (error) {
        console.error('Error al listar productos:', error);
        return { success: false, error: error.message };
    }
}

// eliminarProveedor(2)
export function eliminarProveedor(id) {
    try {
        const stmt = db.prepare(`DELETE FROM proveedor WHERE idProveedor = ?`);
        const result = stmt.run(id);

        return { success: true, changes: result.changes };
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        return { success: false, error: error.message };
    }
}


export function actualizarProveedor(proveedor) {
    try {
        const stmt = db.prepare(`
        UPDATE proveedor
        SET nombre = ?, direccion = ?, telefono = ?
        WHERE idProveedor = ?
      `);

        const result = stmt.run(
            proveedor.nombre,
            proveedor.direccion,
            proveedor.telefono,
            proveedor.id
        );

        return { success: true, changes: result.changes };
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        return { success: false, error: error.message };
    }
}


// module.exports = setupIPCHandlers;
