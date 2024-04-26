import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import dayjs from 'dayjs';
import { Button, Snackbar } from '@mui/material';
import AddTraining from './AddTraining';

export default function Trainings() {

    const [trainings, setTrainings] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const URL = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings';
    const gridRef = useRef();
    const [open, setOpen] = useState(false);

    const [colDefs, setColDefs] = useState([
        { field: 'date', sortable: true, filter: true, flex: 1 },
        { field: 'duration', sortable: true, filter: true, flex: 1 },
        { field: 'activity', sortable: true, filter: true, flex: 1 },
        { field: 'customer', sortable: true, filter: true, flex: 1 },
        { cellRenderer: (params) => <Button color="error" onClick={() => deleteTraining(params.data._links.self.href)}>Delete</Button>, flex: 1 }
    ]);

    useEffect(() => getTrainings(), []);

    //hae treenit, getTrainings
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

    //haetaan ko. treeniin liittyvän asiakkaan nimi
    const fetchCustomerNames = (trainings) => {
        trainings.forEach(training => {
            if (training._links && training._links.customer) {
                console.log(training._links.customer.href);
                fetch(training._links.customer.href, { method: 'GET' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(customerData => {
                        const updatedTrainings = {
                            ...training,
                            customer: customerData.firstname + ' ' + customerData.lastname
                        };
                        setTrainings(prevTrainings => prevTrainings.map(item => item._links.self.href === training._links.self.href ? updatedTrainings : item));
                    })
                    .catch(error => {
                        console.error(`Error fetching customer data from ${training._links.customer.href}:`, error);
                    });
            }
        });
    }

    //lisää treeni, addTraining
    const addTraining = (training) => {
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(training)
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Training added succesfully');
                    setOpenSnackbar(true);
                    return response.json;
                } else {
                    throw new Error('Error with adding training');
                }
            })
            .then(data => {
                console.log("parsed json = " + data);
                getTrainings();
            })
            .catch(err => console.error(err));
    }

    //poista treeni, deleteTraining
    const deleteTraining = (link) => {
        if (window.confirm('Are you sure you want to delete this training?')) {
            fetch(link, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setSnackbarMessage("Training deleted succesfully");
                        setOpenSnackbar(true);
                        getTrainings();
                    } else {
                        setSnackbarMessage("Error with deleting training");
                        setOpenSnackbar(true);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    return (
        <>
            <br></br>
            <AddTraining addTraining={addTraining} />
            <div className="ag-theme-material" style={{ width: '100%', height: '550px' }}>
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
                <Snackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={3000}
                    onClose={() => {
                        setOpenSnackbar(false);
                        setSnackbarMessage('');
                    }}>
                </Snackbar>
            </div>
        </>
    );
}