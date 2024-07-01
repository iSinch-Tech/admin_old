import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import Toolbar from './toolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('moment/locale/ru.js')

const ScheduleCalendar = ({ date, events, onSelectSlot, onSelectEvent, onNavigate, eventPropGetter }) => {
  moment.updateLocale("ru", {
    week: {
      dow: 1
    }
  });
  const localizer = momentLocalizer(moment);

  return (
    <>
      <Calendar
        selectable
        date={date}
        views={[Views.MONTH]}
        components={{toolbar: Toolbar}}
        events={events}
        localizer={localizer}
        onNavigate={(date) => onNavigate && onNavigate(date)}
        eventPropGetter={(event) => eventPropGetter && eventPropGetter(event)}
        onSelectEvent={(slotInfo) => onSelectEvent && onSelectEvent(slotInfo)}
        onSelectSlot={(slotInfo) => onSelectSlot && onSelectSlot(slotInfo)}
        popup={true}
      />
    </>
  );
}

export default ScheduleCalendar;
