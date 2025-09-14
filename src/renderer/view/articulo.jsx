
import * as React from 'react';
import { Alert, Chip, Snackbar, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../src/Extras/dashboard/internals/data/gridData';
// import { esES } from '@mui/x-date-pickers/locales';
import { esES } from '@mui/x-data-grid/locales';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Modal,
} from '@mui/material';
import NotificarUsuario from './alerta';

// import { esES } from '@mui/x-data-grid';
// import { columns, rows } from '../internals/data/gridData';



function CustomizedDataGrid() {
    return (
        <DataGrid
            autoHeight
            checkboxSelection
            rows={rows}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                        },
                        columnInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        operatorInputProps: {
                            variant: 'outlined',
                            size: 'small',
                            sx: { mt: 'auto' },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        },
                    },
                },
            }}
        />
    );
}
const columns2 = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'precio', headerName: 'Precio', width: 130 },
];



const rows2 = [
    { id: 1, nombre: 'Producto A', precio: 10.5 },
    { id: 2, nombre: 'Producto B', precio: 25.0 },
    { id: 3, nombre: 'Producto C', precio: 18.75 },
];

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));


const funBD_insertar = async (data) => {

    const producto = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioCompra: data.precioCompra,
        precioVenta: data.precioVenta,
        cantidadStock: data.cantidad,
        utilidadPercibida: 20
    };

    // const insertar = async () => {
    const res = await window.api.producto.insertar(producto);

    console.log("Respuesta:: ", res);

    if (res.success) {
        console.log('Producto insertado con ID:', res.id);
    } else {
        console.error('Error:', res.error);
    }
    // };

}

const funBD_editar = async (data) => {

    const producto = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioCompra: data.precioCompra,
        precioVenta: data.precioVenta,
        cantidadStock: data.cantidad,
        utilidadPercibida: 20
    };

    // const insertar = async () => {
    const res = await window.api.producto.actulizar(producto);

    console.log("Respuesta:: ", res);

    if (res.success) {
        console.log('Producto insertado con ID:', res.id);
    } else {
        console.error('Error:', res.error);
    }
    // };

}

const funBD_listar = async () => {
    // funBD_getArticulo(9)
    // const insertar = async () => {
    const res = await window.api.producto.listar();

    console.log("Respuesta:: ", res);
    if (res.success) {
        console.log('listadod e proeduto ', res);
        return res.productos.data
    } else {
        console.error('Error:', res.error);
    }
    // };

}

const funBD_getArticulo = async (id) => {

    // const insertar = async () => {
    const res = await window.api.producto.eliminar(2);

    console.log("Respuesta:: ", res);
    if (res.success) {
        console.log('RES ELIMINADO ', res);
        // return res.productos.data
    } else {
        console.error('Error:', res.error);
    }
    // };

}
const funBD_eliminar = async (id) => {

    // const insertar = async () => {
    const res = await window.api.producto.eliminar(id);

    console.log("Respuesta:: ", res);
    if (res.success) {
        console.log('RES ELIMINADO ', res);
        // return res.productos.data
    } else {
        console.error('Error:', res.error);
    }
    // };
}


const Articulo = () => {
    return (
        <>
            <Grid container spacing={3}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="first-name" required>
                        Nombre
                    </FormLabel>
                    <OutlinedInput
                        id="first-name"
                        name="first-name"
                        type="name"
                        placeholder="John"
                        autoComplete="first name"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid xs={12} md={6}>
                    <FormLabel htmlFor="cantidad" required>
                        Cantidad
                    </FormLabel>
                    <OutlinedInput
                        id="cantidad"
                        name="cantidad"
                        type="number"
                        placeholder="0"
                        autoComplete="off"
                        required
                        size="small"
                        inputProps={{ min: 0 }}
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                    <FormLabel htmlFor="address1" required>
                        Address line 1
                    </FormLabel>
                    <OutlinedInput
                        id="address1"
                        name="address1"
                        type="address1"
                        placeholder="Street name and number"
                        autoComplete="shipping address-line1"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                    <FormLabel htmlFor="address2">Address line 2</FormLabel>
                    <OutlinedInput
                        id="address2"
                        name="address2"
                        type="address2"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        autoComplete="shipping address-line2"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 6 }}>
                    <FormLabel htmlFor="city" required>
                        City
                    </FormLabel>
                    <OutlinedInput
                        id="city"
                        name="city"
                        type="city"
                        placeholder="New York"
                        autoComplete="City"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 6 }}>
                    <FormLabel htmlFor="state" required>
                        State
                    </FormLabel>
                    <OutlinedInput
                        id="state"
                        name="state"
                        type="state"
                        placeholder="NY"
                        autoComplete="State"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 6 }}>
                    <FormLabel htmlFor="zip" required>
                        Zip / Postal code
                    </FormLabel>
                    <OutlinedInput
                        id="zip"
                        name="zip"
                        type="zip"
                        placeholder="12345"
                        autoComplete="shipping postal-code"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 6 }}>
                    <FormLabel htmlFor="country" required>
                        Country
                    </FormLabel>
                    <OutlinedInput
                        id="country"
                        name="country"
                        type="country"
                        placeholder="United States"
                        autoComplete="shipping country"
                        required
                        size="small"
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12 }}>
                    <FormControlLabel
                        control={<Checkbox name="saveAddress" value="yes" />}
                        label="Use this address for payment details"
                    />
                </FormGrid>
            </Grid>
        </>
    )



}
export function ComponenteArticulos() {
    const [seleccionados, setSeleccionados] = useState([]);
    const [dataList, setDataList] = useState([]);




    function renderStatus(status) {
        const colors = {
            Online: 'success',
            Offline: 'default',
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }
    async function listarArticulos() {
        const productos = await funBD_listar()
        console.log("PRODUCTOS::", productos);
        const newProdutos = productos.map(item => {
            return { ...item, "status": 'Online' }
        })
        // const newProdutos = productos.map (item =>{
        //     return {...item, renderCell: (params) => renderStatus(params.value),}
        // })


        console.log("newProdutos::", newProdutos);

        setDataList(newProdutos)

    }

    async function limpiar() {

        setDataList([])

    }

    async function MostarSeleccion() {

        console.log("seleccionados::", seleccionados);

        const filasSeleccionadas = dataList.filter((fila) =>
            seleccionados.includes(fila.id)
        );
        console.log("filasSeleccionadas::", filasSeleccionadas);

    }


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const [editarArt, setEditart] =   useState(false)
    async function editar() {
        setEditart(true)

        const filasSeleccionadas = dataList.filter((fila) =>
            seleccionados.includes(fila.id)
        );
        console.log("filasSeleccionadas::--", filasSeleccionadas);
     
        setFormData(
        {   
            "id":filasSeleccionadas[0].id,
            nombre:filasSeleccionadas[0].nombre,
            descripcion:filasSeleccionadas[0].descripcion,
            precioCompra:filasSeleccionadas[0].precio_compra,
            precioVenta:filasSeleccionadas[0].precio_venta,
            cantidad: filasSeleccionadas[0].cantidad_Stock,
        })
        handleOpen()
        
        // setOpen(true)

    }

  
    
    
    const handleSave = (data) => {
      console.log("Guardando", data);
        console.log("editarArt::", editarArt);
        
      if (editarArt){
        
        handleEditar()
      }else{
        handleGuardar()
      }
      listarArticulos()
      setOpen(false);
    };

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precioCompra: '',
        precioVenta: '',
        cantidad: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuardar = () => {
        console.log("Data de ::", formData);

        funBD_insertar(formData)

    }

    const handleEditar = () => {
        console.log("Data de ::", formData);

        funBD_editar(formData)

    }

    const handleNuevo = () => {

        setFormData({
            nombre: '',
            descripcion: '',
            precioCompra: '',
            precioVenta: '',
            cantidad: '',
        })
        setEditart(false)
        handleOpen()


    }

    const handleEliminar = () => {
        console.log("seleccionados::", seleccionados);

        const filasSeleccionadas = dataList.filter((fila) =>
            seleccionados.includes(fila.id)
        );
        console.log("filasSeleccionadas::", filasSeleccionadas);


        // seleccionados.includes(fila.id)
        funBD_eliminar(filasSeleccionadas[0].id)
        listarArticulos()

    }


    // {
    //     "id": 1,
    //     "nombre": "PASTILLA ",
    //     "descripcion": "DESCRIPCION DE PASTILLA",
    //     "precio_compra": "10",
    //     "precio_venta": "15",
    //     "cantidad_Stock": "500"
    // }

    const columnsArticulos = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.value),
        },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'descripcion', headerName: 'Descripcion', width: 130 },
        { field: 'precio_compra', headerName: 'Precio-Compra', width: 130 },
        { field: 'precio_venta', headerName: 'Precio-Venta', width: 130 },
        { field: 'cantidad_Stock', headerName: 'Stock', width: 130 },
    ];


    return (

        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Gestion Articulos
            </Typography>

            <Button variant="contained" color="success" onClick={handleNuevo}>
                    agregar
                </Button>
            {/* <FormGrid size={{ xs: 12, md: 6 }}> */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="contained" color="secondary" onClick={listarArticulos}>
                    Listar
                </Button>
                <Button variant="contained" color="warning" onClick={limpiar}>
                    Limpiar
                </Button>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={editar}>
                    EDITAR
                </Button>
                <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={handleEliminar}>
                    ELIMINAR
                </Button>

            </Box>
            {/* </FormGrid> */}
            <ModalFormulario
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                formData={formData}
                onChange={handleChange}
                productoEditado={editarArt}
            />
            {/* <Articulo /> */}
            {/* <CustomizedDataGrid /> */}
            <DataGrid
                checkboxSelection
                rows={dataList}
                columns={columnsArticulos}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                // localeText={esES.localeText}
                localeText={esES.components.MuiDataGrid.defaultProps?.MuiDataGrid?.localeText || esES.localeText}
                onRowSelectionModelChange={(newSelection) => {
                    setSeleccionados(newSelection);
                }}
                rowSelectionModel={seleccionados}
            />
        </Box>


    );
}



// Estilo del modal
// const style = {
//     position: 'absolute',

//     width: 'auto',
//     // minWidth: 600,
//     // maxWidth: '90vw',

//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     //   width: 600,
//     bgcolor: 'background.paper',
//     borderRadius: 2,
//     boxShadow: 24,
//     p: 4,
// };


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: '1000px',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


function ModalFormulario({ open, onClose, onSave, formData, onChange, productoEditado }) {

    React.useEffect(()=>{




    }, [])
    return (
        <>
            
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>
                        Agregar Producto
                    </Typography>
                    <Grid container spacing={2}>
                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="nombre" required>Nombre</FormLabel>
                            <OutlinedInput
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del producto"
                                required
                                size="small"
                                value={formData.nombre}
                                onChange={onChange}
                            />


                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 8 }}>
                            <FormLabel htmlFor="descripcion" required>Descripcion</FormLabel>
                            <OutlinedInput
                                id="descripcion"
                                name="descripcion"
                                placeholder="Descripcion del producto"
                                required
                                size="small"
                                value={formData.descripcion}
                                onChange={onChange}
                            />


                        </FormGrid>


                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="cantidad" required>Cantidad</FormLabel>
                            <OutlinedInput
                                id="cantidad"
                                name="cantidad"
                                type="number"
                                placeholder="0"
                                inputProps={{ min: 0 }}
                                required
                                size="small"
                                value={formData.cantidad}
                                onChange={onChange}
                            />
                        </FormGrid>
                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="precio-compra" required>Precio de compra</FormLabel>
                            <OutlinedInput
                                id="precio-compra"
                                name="precioCompra"
                                type="number"
                                placeholder="0"
                                inputProps={{ min: 0 }}
                                required
                                size="small"
                                value={formData.precioCompra}
                                onChange={onChange}

                            />
                        </FormGrid>

                        <FormGrid size={{ xs: 12, md: 4 }}>
                            <FormLabel htmlFor="precioVenta" required>Precio de Venta</FormLabel>
                            <OutlinedInput
                                id="precioVenta"
                                name="precioVenta"
                                type="number"
                                placeholder="0"
                                inputProps={{ min: 0 }}
                                required
                                size="small"
                                value={formData.precioVenta}
                                onChange={onChange}
                            />
                        </FormGrid>
                    </Grid>

                    <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                         <Button  variant="contained" color="primary" onClick={() => onSave(formData)}>
                         {productoEditado ? 'Actualizar' : 'Guardar'}
                            
                            </Button>
                         <Button variant="outlined" onClick={onClose}>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
