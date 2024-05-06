import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { Button, Snackbar } from '@mui/material';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import { CSVLink } from 'react-csv';

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
        { field: 'phone', sortable: true, filter: true, flex: 1 },
        { cellRenderer: params => <EditCustomer editCustomer={editCustomer} customer={params.data} link={params.data._links.self.href} />, flex: 1.2 },
        { cellRenderer: (params) => <Button color="error" onClick={() => deleteCustomer(params.data._links.self.href)}>Delete</Button>, flex: 1.2 },
        { //yksittäisen asiaakkaan tiedot csv-muodossa
            cellRenderer: params => {
                const customerData = {
                    firstname: params.data.firstname,
                    lastname: params.data.lastname,
                    streetaddress: params.data.streetaddress,
                    postcode: params.data.postcode,
                    city: params.data.city,
                    email: params.data.email,
                    phone: params.data.phone
                };
                return <CSVLink data={[customerData]} filename="customer_data.csv">Download CSV</CSVLink>
            }, flex: 1.2
        }
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

    //muokkaa asiakkaan tietoja, editCustomer
    const editCustomer = (link, customer) => {
        fetch(link, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Customer edited succesfully');
                    setOpen(true);
                    return response.json;
                } else {
                    throw new Error('Error with editing customer');
                }
            })
            .then(data => {
                console.log("parsed json = " + data);
                getCustomers();
            })
            .catch(err => console.error(err));
    }

    //poista asiakas, deleteCustomer
    const deleteCustomer = (link) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            fetch(link, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setSnackbarMessage('Customer deleted succesfully');
                        setOpenSnackbar(true);
                        getCustomers();
                    } else {
                        setSnackbarMessage('Error with deleting customer');
                        setOpenSnackbar(true);
                    }
                })
                .catch(error => console.error(error));
        }
    }
    //asiakkaat csv-muodossa
    const csvData = customers.map(customer => {
        return {
            firstname: customer.firstname,
            lastname: customer.lastname,
            streetaddress: customer.streetaddress,
            postcode: customer.postcode,
            city: customer.city,
            email: customer.email,
            phone: customer.phone
        }
    });

    return (
        <>
            <br></br>
            <AddCustomer addCustomer={addCustomer} />
            <div className="ag-theme-material" style={{ width: '100%', height: '550px' }}>
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
                <CSVLink data={csvData} filename="customers.csv">Download CSV with all customer data</CSVLink>
            </div>
        </>
    );
}