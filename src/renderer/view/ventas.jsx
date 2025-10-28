import * as React from 'react';
import { Alert, Chip, Snackbar, Typography } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Button,
    Modal,
    IconButton,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import dayjs from 'dayjs';
import CustomDatePickerFecha from '../src/Extras/dashboard/components/CustomDatePicker';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

// Funciones de BD para ventas
const funBD_insertarVenta = async (data) => {
    try {
        const venta = {
            cliente_id: data.cliente_id || null,
            fecha: data.fecha,
            total: data.total,
            detalles: data.detalles
        };
        console.log("Insertando venta:", venta);

        const res = await window.api.ventas.insertar(venta);
        console.log("Respuesta insertar venta:", res);

        return res;
    } catch (error) {
        console.error("Error insertando venta:", error);
        return { success: false, error: error.message };
    }
}

const funBD_editarVenta = async (data) => {
    try {
        const venta = {
            id: data.id,
            cliente_id: data.cliente_id || null,
            fecha: data.fecha,
            total: data.total,
            detalles: data.detalles
        };
        console.log("Editando venta:", venta);

        const res = await window.api.ventas.actualizar(venta);
        console.log("Respuesta editar venta:", res);

        return res;
    } catch (error) {
        console.error("Error editando venta:", error);
        return { success: false, error: error.message };
    }
}

const funBD_listarVentas = async () => {
    try {
        const res = await window.api.ventas.listar();
        console.log("Listando ventas:", res);

        if (res.success) {
            return res;
        }

        return { success: false, data: [] };
    } catch (error) {
        console.error("Error listando ventas:", error);
        return { success: false, error: error.message };
    }
}

const funBD_eliminarVenta = async (id) => {
    try {
        const res = await window.api.ventas.eliminar(id);
        console.log("Eliminando venta ID:", id, res);

        return res;
    } catch (error) {
        console.error("Error eliminando venta:", error);
        return { success: false, error: error.message };
    }
}

const funBD_obtenerDetallesVenta = async (id) => {
    try {
        const res = await window.api.ventas.obtenerDetalles(id);
        console.log("Detalles de venta:", res);

        return res;
    } catch (error) {
        console.error("Error obteniendo detalles:", error);
        return { success: false, error: error.message };
    }
}

const funBD_listarProductos = async () => {
    try {
        const res = await window.api.ventas.listarProductos();
        console.log("Productos:", res);

        if (res.success) {
            return res.data;
        }

        return [];
    } catch (error) {
        console.error("Error listando productos:", error);
        return [];
    }
}

const funBD_listarClientes = async () => {
    try {
        const res = await window.api.ventas.listarClientes();
        console.log("Clientes:", res);

        if (res.success) {
            return res.data;
        }

        return [];
    } catch (error) {
        console.error("Error listando clientes:", error);
        return [];
    }
}

export function ComponenteVentas() {
    const [seleccionados, setSeleccionados] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    function renderStatus(status) {
        const colors = {
            Completada: 'success',
            Pendiente: 'warning',
            Cancelada: 'error',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    async function listarVentas() {
        const result = await funBD_listarVentas();

        if (result.success) {
            const newVentas = result.data.map(item => {
                return { ...item, status: item.status || 'Completada' }
            });
            setDataList(newVentas);
        } else {
            setSnackbar({
                open: true,
                message: 'Error al listar ventas: ' + (result.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    }

    async function cargarProductos() {
        const productosList = await funBD_listarProductos();
        setProductos(productosList);
    }

    async function cargarClientes() {
        const clientesList = await funBD_listarClientes();
        setClientes(clientesList);
    }

    React.useEffect(() => {
        cargarProductos();
        cargarClientes();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const [editarVenta, setEditarVenta] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(false);
    const [ventaDetalles, setVentaDetalles] = useState(null);

    const verDetallesVenta = async (venta) => {
        console.log("Ver detalles de venta:", venta);

        // Obtener detalles de la venta
        const detallesResult = await funBD_obtenerDetallesVenta(venta.id);

        if (detallesResult.success) {
            setVentaDetalles({
                ...venta,
                detalles: detallesResult.data
            });
            setOpenDetalles(true);
        } else {
            setSnackbar({
                open: true,
                message: 'Error al obtener detalles: ' + (detallesResult.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const editarVentaFunc = async (venta) => {
        setEditarVenta(true);
        console.log("Editando venta:", venta);

        // Obtener detalles de la venta
        const detallesResult = await funBD_obtenerDetallesVenta(venta.id);

        const detalles = detallesResult.success ? detallesResult.data : [];

        setFormData({
            id: venta.id,
            cliente_id: venta.cliente_id || '',
            fecha: venta.fecha,
            total: venta.total,
            detalles: detalles
        });
        handleOpen();
    };

    const handleSave = async (data) => {
        console.log("Guardando", data);
        console.log("editarVenta::", editarVenta);

        let result;
        if (editarVenta) {
            result = await handleEditar();
        } else {
            result = await handleGuardar();
        }

        if (result && result.success) {
            setSnackbar({
                open: true,
                message: editarVenta ? 'Venta actualizada exitosamente' : 'Venta registrada exitosamente',
                severity: 'success'
            });
            await listarVentas();
            setOpen(false);
        } else {
            setSnackbar({
                open: true,
                message: 'Error al guardar la venta: ' + (result?.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const [formData, setFormData] = useState({
        cliente_id: '',
        fecha: new Date().toISOString().split('T')[0],
        total: 0,
        detalles: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuardar = async () => {
        console.log("Data de venta::", formData);

        // Validaciones
        if (!formData.detalles || formData.detalles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Debe agregar al menos un producto',
                severity: 'warning'
            });
            return { success: false };
        }

        return await funBD_insertarVenta(formData);
    }

    const handleEditar = async () => {
        console.log("Data de venta::", formData);

        // Validaciones
        if (!formData.detalles || formData.detalles.length === 0) {
            setSnackbar({
                open: true,
                message: 'Debe agregar al menos un producto',
                severity: 'warning'
            });
            return { success: false };
        }

        return await funBD_editarVenta(formData);
    }

    const handleNuevo = () => {
        setFormData({
            cliente_id: '',
            fecha: new Date().toISOString().split('T')[0],
            total: 0,
            detalles: []
        });
        setEditarVenta(false);
        handleOpen();
    }

    const eliminarVenta = async (id) => {
        console.log("Eliminando venta ID:", id);

        const result = await funBD_eliminarVenta(id);

        if (result.success) {
            setSnackbar({
                open: true,
                message: 'Venta eliminada exitosamente',
                severity: 'success'
            });
            await listarVentas();
        } else {
            setSnackbar({
                open: true,
                message: 'Error al eliminar la venta: ' + (result.error || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const columnsVentas = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            minWidth: 100,
            renderCell: (params) => renderStatus(params.value),
        },
        { field: 'cliente_nombre', headerName: 'Cliente', width: 200 },
        { field: 'fecha', headerName: 'Fecha', width: 150 },
        {
            field: 'total',
            headerName: 'Total',
            width: 120,
            renderCell: (params) => `S/. ${params.value?.toFixed(2) || '0.00'}`
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => verDetallesVenta(params.row)}
                        sx={{
                            color: '#3b82f6',
                            '&:hover': { backgroundColor: '#eff6ff', color: '#2563eb' }
                        }}
                        title="Ver detalles"
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => editarVentaFunc(params.row)}
                        sx={{
                            color: '#6b7280',
                            '&:hover': { backgroundColor: '#f9fafb', color: '#4b5563' }
                        }}
                        title="Editar"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => eliminarVenta(params.row.id)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fef2f2', color: '#dc2626' }
                        }}
                        title="Eliminar"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Gestión de Ventas
            </Typography>

            <Box mb={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button
                    variant="contained"
                    onClick={handleNuevo}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Nueva Venta
                </Button>

                <Button
                    variant="contained"
                    onClick={listarVentas}
                    sx={{
                        backgroundColor: '#6b7280',
                        '&:hover': { backgroundColor: '#4b5563' }
                    }}
                >
                    Listar Ventas
                </Button>
            </Box>

            <ModalFormularioVenta
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                formData={formData}
                onChange={handleChange}
                setFormData={setFormData}
                ventaEditada={editarVenta}
                productos={productos}
                clientes={clientes}
            />

            <Box>
                <DataGrid
                    checkboxSelection
                    rows={dataList}
                    columns={columnsVentas}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    localeText={esES.components.MuiDataGrid.defaultProps?.MuiDataGrid?.localeText || esES.localeText}
                    onRowSelectionModelChange={(newSelection) => {
                        setSeleccionados(newSelection);
                    }}
                    rowSelectionModel={seleccionados}
                />
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <ModalDetallesVenta
                open={openDetalles}
                onClose={() => setOpenDetalles(false)}
                venta={ventaDetalles}
            />
        </Box>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '1200px',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflow: 'auto'
};

function ModalFormularioVenta({ open, onClose, onSave, formData, onChange, setFormData, ventaEditada, productos, clientes }) {

    const agregarDetalle = () => {
        const nuevoDetalle = {
            producto_id: '',
            cantidad: 1,
            precio_unitario: 0,
            subtotal: 0
        };
        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, nuevoDetalle]
        }));
    };

    const eliminarDetalle = (index) => {
        const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            detalles: nuevosDetalles
        }));
        calcularTotal(nuevosDetalles);
    };

    const actualizarDetalle = (index, campo, valor) => {
        const nuevosDetalles = [...formData.detalles];
        nuevosDetalles[index][campo] = valor;

        // Si se cambia el producto, actualizar el precio automáticamente
        if (campo === 'producto_id') {
            const productoSeleccionado = productos.find(p => p.id === valor);
            if (productoSeleccionado) {
                nuevosDetalles[index].precio_unitario = productoSeleccionado.precio;
                nuevosDetalles[index].subtotal = nuevosDetalles[index].cantidad * productoSeleccionado.precio;
            }
        }

        if (campo === 'cantidad' || campo === 'precio_unitario') {
            nuevosDetalles[index].subtotal = nuevosDetalles[index].cantidad * nuevosDetalles[index].precio_unitario;
        }

        setFormData(prev => ({
            ...prev,
            detalles: nuevosDetalles
        }));
        calcularTotal(nuevosDetalles);
    };

    const calcularTotal = (detalles = formData.detalles) => {
        const total = detalles.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0);
        setFormData(prev => ({
            ...prev,
            total: total
        }));
    };

    const [value, setValue] = React.useState(dayjs());

    React.useEffect(() => {
        if (formData.fecha) {
            // setValue(dayjs(formData.fecha));
        }
    }, [formData.fecha]);

    React.useEffect(() => {
        if (value) {
            const fechaFormateada = value.format('YYYY-MM-DD');
            if (fechaFormateada !== formData.fecha) {
                onChange({ target: { name: 'fecha', value: fechaFormateada } });
            }
        }
    }, [value]);

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        {ventaEditada ? 'Editar Venta' : 'Nueva Venta'}
                    </Typography>

                    <Grid container spacing={2}>
                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="cliente_id">Cliente</FormLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={formData.cliente_id}
                                    onChange={(e) => onChange({ target: { name: 'cliente_id', value: e.target.value } })}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Sin cliente / Venta general</em>
                                    </MenuItem>
                                    {clientes.map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id}>
                                            {cliente.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="fecha" required>Fecha</FormLabel>
                            <CustomDatePickerFecha value={value} setValue={setValue} />
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel>Total</FormLabel>
                            <OutlinedInput
                                value={`S/. ${formData.total.toFixed(2)}`}
                                disabled
                                size="small"
                            />
                        </FormGrid>
                    </Grid>

                    <Box mt={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1">Productos</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={agregarDetalle}
                                sx={{
                                    backgroundColor: '#6b7280',
                                    '&:hover': { backgroundColor: '#4b5563' }
                                }}
                            >
                                Agregar Producto
                            </Button>
                        </Box>

                        {formData.detalles.map((detalle, index) => {
                            const productoSeleccionado = productos.find(p => p.id === detalle.producto_id);
                            const stockDisponible = productoSeleccionado?.stock || 0;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 1,
                                        p: 2,
                                        mb: 2,
                                        // backgroundColor: '#f9fafb'
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <FormGrid size={{ xs: 12, md: 4 }}>
                                            <FormLabel>Producto</FormLabel>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={detalle.producto_id}
                                                    onChange={(e) => actualizarDetalle(index, 'producto_id', e.target.value)}
                                                >
                                                    {productos.map((producto) => (
                                                        <MenuItem key={producto.id} value={producto.id}>
                                                            {producto.nombre} (Stock: {producto.stock})
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </FormGrid>

                                        <FormGrid size={{ xs: 12, md: 2 }}>
                                            <FormLabel>Cantidad</FormLabel>
                                            <OutlinedInput
                                                type="number"
                                                value={detalle.cantidad}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    // Si está vacío, permitir vacío temporalmente para que el usuario pueda escribir
                                                    if (valor === '') {
                                                        actualizarDetalle(index, 'cantidad', '');
                                                    } else {
                                                        // Convertir a entero para eliminar ceros a la izquierda
                                                        const numero = parseInt(valor, 10);
                                                        if (!isNaN(numero) && numero >= 1) {
                                                            actualizarDetalle(index, 'cantidad', numero);
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Al perder el foco, si está vacío o es 0, establecer 1
                                                    if (e.target.value === '' || e.target.value === '0') {
                                                        actualizarDetalle(index, 'cantidad', 1);
                                                    }
                                                }}
                                                size="small"
                                                inputProps={{ min: 1, max: stockDisponible }}
                                            />
                                            {productoSeleccionado && detalle.cantidad > stockDisponible && (
                                                <Typography variant="caption" color="error">
                                                    Stock insuficiente
                                                </Typography>
                                            )}
                                        </FormGrid>

                                        <FormGrid size={{ xs: 12, md: 2 }}>
                                            <FormLabel>Precio Unit.</FormLabel>
                                            <OutlinedInput
                                                type="number"
                                                value={detalle.precio_unitario}
                                                onChange={(e) => actualizarDetalle(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                                                size="small"
                                                startAdornment="S/."
                                            />
                                        </FormGrid>

                                        <FormGrid size={{ xs: 12, md: 2 }}>
                                            <FormLabel>Subtotal</FormLabel>
                                            <OutlinedInput
                                                value={`S/. ${detalle.subtotal.toFixed(2)}`}
                                                disabled
                                                size="small"
                                            />
                                        </FormGrid>

                                        <FormGrid size={{ xs: 12, md: 2 }}>
                                            <FormLabel>&nbsp;</FormLabel>
                                            <IconButton
                                                onClick={() => eliminarDetalle(index)}
                                                sx={{
                                                    color: '#ef4444',
                                                    '&:hover': { backgroundColor: '#fef2f2' }
                                                }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </FormGrid>
                                    </Grid>
                                </Box>
                            );
                        })}

                        {formData.detalles.length === 0 && (
                            <Typography variant="body2" color="text.secondary" align="center" py={2}>
                                No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
                            </Typography>
                        )}
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onSave}
                            sx={{
                                backgroundColor: '#6b7280',
                                '&:hover': { backgroundColor: '#4b5563' }
                            }}
                        >
                            {ventaEditada ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

// Modal para ver detalles de la venta (solo lectura)
function ModalDetallesVenta({ open, onClose, venta }) {
    if (!venta) return null;

    const styleDetalles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '900px',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto'
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={styleDetalles}>
                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #e5e7eb', pb: 2, mb: 3 }}>
                    Detalles de Venta #{venta.id}
                </Typography>

                {/* Información General */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Cliente
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                            {venta.cliente_nombre || 'Venta General'}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Fecha
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                            {new Date(venta.fecha).toLocaleDateString('es-PE')}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Total
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="600">
                            S/. {venta.total.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Tabla de Productos */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Productos Vendidos
                </Typography>

                <Box sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 1,
                    overflow: 'hidden'
                }}>
                    {/* Header de tabla */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: 2,
                            p: 2,
                            // backgroundColor: '#f9fafb',
                            fontWeight: 600,
                            borderBottom: '1px solid #e5e7eb'
                        }}
                    >
                        <Typography variant="body2" fontWeight="600">Producto</Typography>
                        <Typography variant="body2" fontWeight="600" textAlign="right">Cantidad</Typography>
                        <Typography variant="body2" fontWeight="600" textAlign="right">Precio Unit.</Typography>
                        <Typography variant="body2" fontWeight="600" textAlign="right">Subtotal</Typography>
                    </Box>

                    {/* Filas de productos */}
                    {venta.detalles && venta.detalles.map((detalle, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                gap: 2,
                                p: 2,
                                borderBottom: index < venta.detalles.length - 1 ? '1px solid #e5e7eb' : 'none',
                                '&:hover': { backgroundColor: '#f9fafb' }
                            }}
                        >
                            <Typography variant="body2">{detalle.producto_nombre}</Typography>
                            <Typography variant="body2" textAlign="right">{detalle.cantidad}</Typography>
                            <Typography variant="body2" textAlign="right">S/. {detalle.precio_unitario.toFixed(2)}</Typography>
                            <Typography variant="body2" textAlign="right" fontWeight="500">
                                S/. {detalle.subtotal.toFixed(2)}
                            </Typography>
                        </Box>
                    ))}

                    {/* Total */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: 2,
                            p: 2,
                            // backgroundColor: '#f3f4f6',
                            borderTop: '2px solid #e5e7eb'
                        }}
                    >
                        <Typography variant="body1" fontWeight="700"></Typography>
                        <Typography variant="body1" fontWeight="700" textAlign="right"></Typography>
                        <Typography variant="body1" fontWeight="700" textAlign="right">TOTAL:</Typography>
                        <Typography variant="body1" fontWeight="700" textAlign="right" color="primary">
                            S/. {venta.total.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="contained" onClick={onClose}>
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
