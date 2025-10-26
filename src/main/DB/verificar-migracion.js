import db from './conexion';

/**
 * Script para verificar y ejecutar manualmente la migración de cliente_id en la tabla venta
 * Ejecutar este script si necesitas agregar la columna cliente_id manualmente
 */

function verificarYMigrarClienteId() {
    try {
        console.log('=== Verificando estructura de la tabla venta ===');

        // Verificar columnas actuales
        const checkColumn = db.prepare(`PRAGMA table_info(venta)`).all();
        console.log('Columnas actuales en tabla venta:');
        checkColumn.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        // Verificar si existe cliente_id
        const hasClienteId = checkColumn.some(col => col.name === 'cliente_id');

        if (hasClienteId) {
            console.log('\n✓ La columna cliente_id ya existe en la tabla venta');
            return { success: true, message: 'Columna cliente_id ya existe' };
        } else {
            console.log('\n✗ La columna cliente_id NO existe. Agregando...');

            // Agregar la columna
            db.exec(`
                ALTER TABLE venta ADD COLUMN cliente_id INTEGER;
            `);

            console.log('✓ Columna cliente_id agregada exitosamente');

            // Verificar que se agregó correctamente
            const verifyColumn = db.prepare(`PRAGMA table_info(venta)`).all();
            const verified = verifyColumn.some(col => col.name === 'cliente_id');

            if (verified) {
                console.log('✓ Verificación exitosa: la columna cliente_id está presente');
                return { success: true, message: 'Columna cliente_id agregada correctamente' };
            } else {
                console.error('✗ Error: No se pudo verificar la columna cliente_id');
                return { success: false, message: 'Error en la verificación' };
            }
        }
    } catch (error) {
        console.error('\n✗ Error durante la migración:', error.message);
        return { success: false, error: error.message };
    }
}

// Ejecutar verificación
console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  VERIFICACIÓN Y MIGRACIÓN - TABLA VENTA           ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const resultado = verificarYMigrarClienteId();

console.log('\n=== Resultado Final ===');
console.log(resultado);

export default verificarYMigrarClienteId;
