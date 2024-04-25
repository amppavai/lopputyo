import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import dayjs from 'dayjs';

export default function Trainings() {

    const [trainings, setTrainings] = useState([]);
    //const [customers, setCustomers] = useState([]);
    //snackbar
    const URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings';
    const gridRef = useRef();
    //open setopen

    //column definitions
    const [colDefs, setColDefs] = useState([
        { field: 'date', sortable: true, filter: true, flex: 1 },
        { field: 'duration', sortable: true, filter: true, flex: 1 },
        { field: 'activity', sortable: true, filter: true, flex: 1 },
        { field: 'customer', sortable: true, filter: true, flex: 1 }
    ]);

    useEffect(() => getTrainings(), []);

    const getTrainings = () => {
        fetch(URL, { method: 'GET' })
            .then(response => response.json())
            .then(responsedata => {
                const formattedTrainings = responsedata._embedded.trainings.map(trainings => ({
                    ...trainings,
                    date: dayjs(trainings.date).format('DD.MM.YYYY HH:MM'),
                }));
                setTrainings(formattedTrainings);
                fetchCustomerNames(formattedTrainings);
            })
            .catch(error => console.error(error));
    }

    const fetchCustomerNames = (trainings) => {
        trainings.forEach(training => {
            //GET -pyyntö jokaisen training-objektin sisältämän asiakkaan URL-osoitteeseen
            fetch(training._links.customer.href, { method: 'GET' })
                .then(response => response.json())
                .then(customerData => {
                    const updatedTrainings = {
                        ...training,
                        customer: customerData.firstname + ' ' + customerData.lastname
                    };
                    setTrainings(prevTrainings => prevTrainings.map(item => item._links.self.href === training._links.self.href ? updatedTrainings : item));
                })
                .catch(error => console.error(error));
        });
    }

    return (
        <>
            <div className="ag-theme-material" style={{ width: '100%', height: '600px' }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 30]}
                    animateRows={true}
                    rowSelection='single'
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                />
            </div>
        </>
    );
}