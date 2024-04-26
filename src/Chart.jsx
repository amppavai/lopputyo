import React, { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';

export default function Chart() {

    const [data, setData] = useState([]);

    const getTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', { method: 'GET' })
            .then(response => response.json())
            .then(responsedata => {
                let formattedTrainings = responsedata._embedded.trainings.map((training, index) => ({
                    ...training,
                    date: dayjs(training.date).format('DD.MM.YYYY HH:MM'),
                    id: index,
                }));
                formattedTrainings = formattedTrainings.reduce((acc, training) => {
                    const existingTraining = acc.find(t => t.activity === training.activity);
                    if (existingTraining) {
                        existingTraining.duration += training.duration;
                    } else {
                        acc.push({
                            activity: training.activity,
                            duration: training.duration,
                        });
                    }
                    return acc;
                }, []);
                setData(formattedTrainings);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        getTrainings();
    }, []);

    return (
        <>
        <h2>Chart of all activities and durations</h2>
        <p>This much our clients have been sweating, impressive!</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart /* width={600} height={300}  */ data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
