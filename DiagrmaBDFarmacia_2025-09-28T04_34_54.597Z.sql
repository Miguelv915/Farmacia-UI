CREATE TABLE IF NOT EXISTS "users" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "producto" (
	"id" INTEGER NOT NULL UNIQUE,
	"nombre" TEXT NOT NULL,
	"descripcion" TEXT NOT NULL,
	"precio_compra" TEXT NOT NULL,
	"precio_venta" TEXT NOT NULL,
	"cantidad_Stock" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "Cliente" (
	"idCliente" INTEGER NOT NULL UNIQUE,
	"nombre" TEXT,
	"telefono" TEXT,
	"direccion" TEXT,
	PRIMARY KEY("idCliente")
);

CREATE TABLE IF NOT EXISTS "Empleado" (
	"idEmpleado" INTEGER NOT NULL UNIQUE,
	"nombre" TEXT,
	"puesto" TEXT,
	PRIMARY KEY("idEmpleado")
);

CREATE TABLE IF NOT EXISTS "Proveedor" (
	"idProveedor" INTEGER NOT NULL UNIQUE,
	"nombre" TEXT,
	"direccion" TEXT,
	"telefono" TEXT,
	PRIMARY KEY("idProveedor")
);

CREATE TABLE IF NOT EXISTS "categorias" (
	"idCategoria" INTEGER NOT NULL UNIQUE,
	"nombre" TEXT NOT NULL,
	"descripcion" TEXT,
	PRIMARY KEY("idCategoria")
);

CREATE TABLE IF NOT EXISTS "Factura" (
	"idFactura" INTEGER NOT NULL UNIQUE,
	"idCliente" INTEGER,
	"idEmpleado" INTEGER,
	"fecha" TEXT,
	"total" REAL,
	PRIMARY KEY("idFactura"),
	FOREIGN KEY ("idCliente") REFERENCES "Cliente"("idCliente")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("idEmpleado") REFERENCES "Empleado"("idEmpleado")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Pedido" (
	"idPedido" INTEGER NOT NULL UNIQUE,
	"fechaPedido" TEXT,
	"cantidad" INTEGER,
	PRIMARY KEY("idPedido")
);

CREATE TABLE IF NOT EXISTS "compras" (
	"idcompras" INTEGER NOT NULL UNIQUE,
	"proveedor_id" INTEGER NOT NULL,
	"fecha" DATETIME DEFAULT CURRENT_TIMESTAMP,
	"total" REAL NOT NULL,
	PRIMARY KEY("idcompras"),
	FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor"("idProveedor")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "detalle_compras" (
	"idDetalle_compras" INTEGER NOT NULL UNIQUE,
	"compra_id" INTEGER NOT NULL,
	"producto_id" INTEGER NOT NULL,
	"cantidad" INTEGER NOT NULL,
	"precio_compra" REAL NOT NULL,
	"subtotal" REAL NOT NULL,
	PRIMARY KEY("idDetalle_compras"),
	FOREIGN KEY ("compra_id") REFERENCES "compras"("idcompras")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("producto_id") REFERENCES "producto"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "venta" (
	"idVenta" INTEGER NOT NULL UNIQUE,
	"fecha" DATETIME DEFAULT CURRENT_TIMESTAMP,
	"total" REAL NOT NULL,
	PRIMARY KEY("idVenta")
);

CREATE TABLE IF NOT EXISTS "detalle_ventas" (
	"id" INTEGER NOT NULL UNIQUE,
	"venta_id" INTEGER NOT NULL,
	"producto_id" INTEGER NOT NULL,
	"cantidad" INTEGER NOT NULL,
	"precio_unitario" REAL NOT NULL,
	"subtotal" REAL NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("venta_id") REFERENCES "venta"("idVenta")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("producto_id") REFERENCES "producto"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
