import db from "../DB/conexion";

export function insertarCliente(cliente) {

    // idCliente INTEGER PRIMARY KEY AUTOINCREMENT,
    // nombre TEXT,
    // telefono TEXT,
    // direccion TEXT
    console.log("Insertando cliente");

    console.log("Data:", cliente);

    try {
        const stmt = db.prepare(`
      INSERT INTO Cliente (nombre, telefono, direccion)
      VALUES (?, ?, ?)
    `);

        const info = stmt.run(
            cliente.nombre,
            cliente.telefono,
            cliente.direccion
        );

        return { success: true, id: info.lastInsertRowid };
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        return { success: false, error: error.message };
    }

}

// insertarCliente ({"nombre":"Juan P�rez","telefono":"987654321","direccion":"Av. Los Pinos 123, Lima" })

// listarCliente()
export function listarCliente() {
    try {
        const stmt = db.prepare(`
        SELECT idCliente as "id", nombre, telefono, direccion
        FROM Cliente
      `);

        const clientes = stmt.all(); // Retorna todos los resultados en un array
        console.log("::", clientes);

        return { success: true, data: clientes };
    } catch (error) {
        console.error('Error al listar clientes:', error);
        return { success: false, error: error.message };
    }
}

// eliminarCliente(2)
export function eliminarCliente(id) {
    try {
        const stmt = db.prepare(`DELETE FROM Cliente WHERE idCliente = ?`);
        const result = stmt.run(id);

        return { success: true, changes: result.changes };
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        return { success: false, error: error.message };
    }
}


export function actualizarCliente(cliente) {
    try {
        const stmt = db.prepare(`
        UPDATE Cliente
        SET nombre = ?, telefono = ?, direccion = ?
        WHERE idCliente = ?
      `);

        const result = stmt.run(
            cliente.nombre,
            cliente.telefono,
            cliente.direccion,
            cliente.id
        );

        return { success: true, changes: result.changes };
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return { success: false, error: error.message };
    }
}


// module.exports = setupIPCHandlers;