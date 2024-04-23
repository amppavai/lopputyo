import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function Customers() {

    const [customers, setCustomers] = useState([]);
    //snackbar
    const URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
    const gridRef = useRef();
    //open setopen

    //column definitions
    const [colDefs, setColDefs] = useState([
        { field: 'firstname', sortable: true, filter: true },
        { field: 'lastname', sortable: true, filter: true },
        { field: 'streetaddress', sortable: true, filter: true },
        { field: 'postcode', sortable: true, filter: true },
        { field: 'city', sortable: true, filter: true },
        { field: 'email', sortable: true, filter: true },
        { field: 'phone', sortable: true, filter: true }
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

    return (
        <>
            <div className="ag-theme-material" style={{ width: '120%', height: '600px' }}>
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
            </div>
        </>
    );
}