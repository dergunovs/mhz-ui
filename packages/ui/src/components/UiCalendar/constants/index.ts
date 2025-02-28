import { ICalendarEvent } from '../interface';

export const EVENTS: ICalendarEvent<object>[] = [
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '+',
    content: [{ id: 1, text: 'Text' }],
    color: 'linear-gradient(90deg, #ff0086 50%, #8d00ff 50%)',
  },
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '+',
    content: [{ id: 2, text: 'Text 2' }],
  },
];
