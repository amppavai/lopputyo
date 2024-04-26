import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";

export default function Calendar() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchBookedTrainings();
    }, []);

/*     const fetchBookedTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data._embedded.trainings.map(training => {
                    const customerName = training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : 'Unknown';
                    return {
                        title: `${customerName}: ${training.activity}`,
                        start: dayjs(training.date).format('YYYY-MM-DD HH:mm'),
                        end: dayjs(training.date).add(training.duration, 'minutes').format('YYYY-MM-DD HH:mm'),
                        allDay: false
                    };
                });
                setEvents(formattedEvents);
            })
            .catch(error => console.error(error));
    } */

    

    const fetchBookedTrainings = () => {
    fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const trainings = data._embedded.trainings;
            fetchCustomerNames(trainings);
        })
        .catch(error => console.error(error));
}

const fetchCustomerNames = (trainings) => {
    trainings.forEach(training => {
        if (training._links && training._links.customer) {
            fetch(training._links.customer.href, { method: 'GET' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(customerData => {
                    const formattedEvent = {
                        title: `${training.activity} (${customerData.firstname} ${customerData.lastname}) `,
                        start: dayjs(training.date).format('YYYY-MM-DD HH:mm'),
                        end: dayjs(training.date).add(training.duration, 'minutes').format('YYYY-MM-DD HH:mm'),
                        allDay: false
                    };
                    setEvents(prevEvents => [...prevEvents, formattedEvent]);
                })
                .catch(error => {
                    console.error(`Error fetching customer data from ${training._links.customer.href}:`, error);
                });
        }
    });
}

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
            />
        </>
    )
}