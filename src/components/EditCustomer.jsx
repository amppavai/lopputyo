import React from "react";
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from "@mui/material";

export default function EditCustomer(props) {
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
        setCustomer({
            firstname: props.customer.firstname,
            lastname: props.customer.lastname,
            streetaddress: props.customer.streetaddress,
            postcode: props.customer.postcode,
            city: props.customer.city,
            email: props.customer.email,
            phone: props.customer.phone
        });
        setOpen(true);
    }
    const handleSave = () => {
        props.editCustomer(props.link, customer);
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return (
        <>
            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open}>
                <DialogTitle>Edit this customer</DialogTitle>
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
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog >

        </>
    )
}