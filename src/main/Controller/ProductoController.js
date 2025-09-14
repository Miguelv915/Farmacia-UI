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


export function listarProductos() {
    try {
      const stmt = db.prepare(`
        SELECT id, nombre, descripcion, precio_compra, precio_venta, cantidad_Stock
        FROM producto
      `);
  
      const productos = stmt.all(); // Retorna todos los resultados en un array
  
      return { success: true, data: productos };
    } catch (error) {
      console.error('Error al listar productos:', error);
      return { success: false, error: error.message };
    }
}


export function eliminarProducto(id) {
    try {
      const stmt = db.prepare(`DELETE FROM producto WHERE id = ?`);
      const result = stmt.run(id);
  
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { success: false, error: error.message };
    }
  }


  export function actualizarProducto(producto) {
    try {
      const stmt = db.prepare(`
        UPDATE producto
        SET nombre = ?, descripcion = ?, precio_compra = ?, precio_venta = ?, cantidad_Stock = ?
        WHERE id = ?
      `);
  
      const result = stmt.run(
        producto.nombre,
        producto.descripcion,
        producto.precioCompra,
        producto.precioVenta,
        producto.cantidadStock,
        producto.id
      );
  
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { success: false, error: error.message };
    }
  }
  

// module.exports = setupIPCHandlers;
