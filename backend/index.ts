import express from 'express';
import cors from 'cors';
import activitiesRouter from './features/activities/activities.routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/activities', activitiesRouter);
app.get('/health', (req, res) =>{
    res.send({ok: true})
});

app.listen(port, () => {
    console.log(`Test app listening on port ${port}`)
});