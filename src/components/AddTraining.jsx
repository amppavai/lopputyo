import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';


export default function AddTraining({ addTraining }) {

    //tilat
    const [newTraining, setNewTraining] = useState({
        date: '',
        duration: '',
        activity: '',
        customer: ''
    });

    //asiakkaan liittäminen treeniin
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [customerUrl, setCustomerUrl] = useState('');
    const [customers, setCustomers] = useState([]);

    //dialogin tila
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }

    function fetchCustomerData(firstName, lastName) {
        //haetaan asiakastiedot etu- ja sukunimen perusteella
        return fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/customers?firstname=${firstName}&lastname=${lastName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                //etsitään asiakas, jolla on annetut etu- ja sukunimet
                const matchingCustomers = data._embedded.customers.filter(customer =>
                    //vertaillaan pienillä kirjaimilla, jotta vertailu ei ole case-sensitive
                    customer.firstname.toLowerCase() === firstName.toLowerCase() &&
                    customer.lastname.toLowerCase() === lastName.toLowerCase()
                );
                //jos asiakas löytyy, palautetaan se
                if (matchingCustomers.length > 0) {
                    return matchingCustomers[0];
                } else {
                    throw new Error(`No customer found with name ${firstName} ${lastName}`);
                }
            });
    }

    useEffect(() => {
        //haetaan asiakasdata, kun etu- ja sukunimi muuttuu
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data._embedded.customers))
        if (firstName && lastName) {
            fetchCustomerData(firstName, lastName).then(data => {
                setCustomerUrl(data._links.self.href);
            })
                .catch(error => console.error('Error:', error));
        }
    }, [firstName, lastName]);

    const handleSave = () => {
        //tarkistetaan ensin onko asiakas olemassa
        fetchCustomerData(firstName, lastName)
            .then(customer => {
                const formattedTraining = {
                    //muutetaan päivämäärä ISO-muotoon
                    date: dayjs(newTraining.date, 'YYYY-MM-DDTHH:mm').toISOString(),
                    duration: newTraining.duration,
                    activity: newTraining.activity,
                    customer: customer._links.self.href
                };
                addTraining(formattedTraining);
                setOpen(false);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No customer found with the given name');
            })
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>Add Training</Button>
            <Dialog
                open={open}>
                <DialogTitle>Add a new Training</DialogTitle>
                <DialogContent>
                    <TextField
                        label=""
                        type="datetime-local"
                        value={newTraining.date}
                        onChange={e => setNewTraining({ ...newTraining, date: e.target.value })}
                    />
                    <TextField
                        label="Duration"
                        value={newTraining.duration}
                        onChange={e => setNewTraining({ ...newTraining, duration: e.target.value })}
                    />
                    <TextField
                        label="Activity"
                        value={newTraining.activity}
                        onChange={e => setNewTraining({ ...newTraining, activity: e.target.value })}
                    />
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={handleSave}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}