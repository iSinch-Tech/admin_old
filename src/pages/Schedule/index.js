import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
	CircularProgress,
  Grid,
  Typography,
  Paper,
} from '@mui/material'
import Page from '../../components/Page';
import { getByMonth, deleteCell, updateCell, createCell } from '../../api/schedule';
import CustomBox from '../../components/CustomBox';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import { DateTime } from 'luxon';
import EditEventDialog from '../../components/EditEventDialog';
import CreateEventDialog from '../../components/CreateEventDialog';
import moment from 'moment';

function getDate(str, DateTimeObj) {
  return DateTimeObj.fromISO(str).toJSDate()
}

function cellToEvent(cell) {
  return {
    id: cell.id,
    title: cell.userId ? cell.user.name : 'Пусто',
    allDay: true,
    start: getDate(cell.date, DateTime),
    end: getDate(cell.date, DateTime),
    cell,
  }
}

const SchedulePage = () => {
  const { month } = useParams();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSeletedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [force, setForce] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData(m) {
			setLoading(true);
			const schedule = await getByMonth(m);
      setEvents(schedule.map(cellToEvent));
			setLoading(false);
		}
		
		fetchData(month);
  }, [month, force])

  if (!month) {
    return <Navigate to={`/schedule/${moment().format('YYYY-MM')}`} />
  }

  const closeEventDialog = async ({action, data}) => {
    setSeletedEvent(null);
    switch (action) {
      case 'update':
        const updatedCell = await updateCell(data.id, data);
        setEvents(events.map(e => e.id === updatedCell.id ? cellToEvent(updatedCell) : e))
        break;
      case 'delete':
        await deleteCell(data.id);
        setEvents(events.filter(e => e.id !== data.id))
        break;
      case 'close':
      default:
    }
  }

  const closeCreateDialog = async (count) => {
    if (count) {
      await createCell({
        date: moment(selectedSlot.start).format('YYYY-MM-DD'),
        count
      });
      setForce(new Date());
    }
    setSelectedSlot(null);
  }

  return (
		<Page title={`Запись на обучение`}>
      {loading ? (
				<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%'}}/>
			) : (
				<>
          <CustomBox style={{margin: '40px 0 10px 0'}}>
						<Grid container spacing={2} alignItems='center'>
							<Grid item xs={9}>
								<Typography
									variant='h4'
									gutterBottom
									style={{fontWeight: '700'}}
								>
									Запись на обучение
								</Typography>
							</Grid>
						</Grid>
					</CustomBox>
          <Paper style={{margin: '0 0 15px 0', padding: '20px', height: '800px'}}>
            <ScheduleCalendar
              date={month + '-01'}
              events={events}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
              onSelectEvent={(event) => setSeletedEvent(event)}
              onNavigate={(date) => navigate(`/schedule/${moment(date).format('YYYY-MM')}`)}
              eventPropGetter={(event) => {
                const style = {
                  'backgroundColor': event.cell.userId ? '#2e7d32' : '#bedd9a',
                };
                return { style }
              }}
            />
            <EditEventDialog event={selectedEvent} onClose={closeEventDialog} />
            <CreateEventDialog slot={selectedSlot} onClose={closeCreateDialog} />
          </Paper>
        </>
      )}
    </Page>
  )
}

export default SchedulePage;