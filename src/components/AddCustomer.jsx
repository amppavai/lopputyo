import React from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from "@mui/material";

export default function AddCustomer(props) {

    const [customer, setCustomer] = React.useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleSave = () => {
        props.addCustomer(customer);
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>Add Customer</Button>
            <Dialog
                open={open}>
                <DialogTitle>Add a new Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Firstname"
                        value={customer.firstname}
                        onChange={(e) => setCustomer({ ...customer, firstname: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="Lastname"
                        value={customer.lastname}
                        onChange={(e) => setCustomer({ ...customer, lastname: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="Streetaddress"
                        value={customer.streetaddress}
                        onChange={(e) => setCustomer({ ...customer, streetaddress: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="Postcode"
                        value={customer.postcode}
                        onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="City"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                    <TextField
                        label="Phone"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        variant="standard"
                        fullWidth>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={handleSave}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )



}