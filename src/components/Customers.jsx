import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCustomer from './AddCustomer';
import { Snackbar } from '@mui/material';

export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
    const gridRef = useRef();
    const [open, setOpen] = useState(false);

    const [colDefs, setColDefs] = useState([
        { field: 'firstname', sortable: true, filter: true, flex: 1 },
        { field: 'lastname', sortable: true, filter: true, flex: 1 },
        { field: 'streetaddress', sortable: true, filter: true, flex: 1 },
        { field: 'postcode', sortable: true, filter: true, flex: 1 },
        { field: 'city', sortable: true, filter: true, flex: 1 },
        { field: 'email', sortable: true, filter: true, flex: 1 },
        { field: 'phone', sortable: true, filter: true, flex: 1 }
    ]);

    useEffect(() => getCustomers(), []);

    //hae asiakkaat, getCustomers
    const getCustomers = () => {
        fetch(URL, { method: 'GET' })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responsedata => {
                console.log(responsedata._embedded.customers);
                setCustomers(responsedata._embedded.customers);
            })
            .catch(error => console.error(error));
    }

    //lisää asiakas, addCustomer
    const addCustomer = (customer) => {
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Customer added succesfully');
                    setOpen(true);
                    return response.json;
                } else {
                    throw new Error('Error with adding customer');
                }
            })
            .then(data => {
                console.log("parsed json = " + data);
                getCustomers();
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <br></br>
            <AddCustomer addCustomer={addCustomer} />
            <div className="ag-theme-material" style={{ width: '100%', height: '600px' }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 30]}
                    animateRows={true}
                    rowSelection='single'
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                >
                </AgGridReact>
                <Snackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={3000}
                    onClose={() => {
                        setOpenSnackbar(false);
                        setSnackbarMessage('');
                    }}
                ></Snackbar>
            </div>
        </>
    );
}