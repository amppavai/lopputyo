import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import * as bootstrap from "bootstrap";
import "./App.css";

export default function Calendar() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchBookedTrainings();
    }, []);

    const fetchBookedTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const trainings = data._embedded.trainings;
                fetchCustomerNames(trainings);
            })
            .catch(error => console.error(error));
    }

    //täysin chagpt:n toteuttama, tarkempi selostus oppimispäiväkirjassa
    //ongelmana oli tietojen näkyminen tuplana kalenterissa
    const fetchCustomerNames = (traingings) => {
        const promises = traingings.map(training => {
            if (training._links && training._links.customer) {
                return fetch(training._links.customer.href, { method: 'GET' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(customerData => {
                        return {
                            title: `${training.activity} (${customerData.firstname} ${customerData.lastname}) `,
                            start: dayjs(training.date).format('YYYY-MM-DD HH:mm'),
                            end: dayjs(training.date).add(training.duration, 'minutes').format('YYYY-MM-DD HH:mm'),
                            allDay: false
                        };
                    })
                    .catch(error => {
                        console.error(`Error fetching customer data from ${training._links.customer.href}:`, error);
                    });
            }
        });
        Promise.all(promises)
            .then(formattedTrainings => {
                setEvents(formattedTrainings);
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
                eventMouseEnter={(info) => {
                    const start = dayjs(info.event.start).format('HH:mm');
                    const end = dayjs(info.event.end).format('HH:mm');
                    new bootstrap.Tooltip(info.el, {
                        title: `${info.event.title}<br> Start: ${start}<br> End: ${end}`,
                        placement: 'auto',
                        trigger: 'hover',
                        container: 'body',
                        customClass: 'tooltip-custom',
                        html: true
                    });
                }}
                eventMouseLeave={(info) => {
                    if (info.el.tooltip) {
                        info.el.tooltip.dispose();
                        info.el.tooltip = null;
                    }
                }}
            />
        </>
    )
}