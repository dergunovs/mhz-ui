import { ICalendarEvent } from '../interface';

export const EVENTS: ICalendarEvent<object>[] = [
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '+',
    content: [{ id: 1, text: 'Text' }],
    color: 'linear-gradient(135deg, rgb(168, 60, 255) 36%, rgb(235, 0, 123) 69%, rgb(251, 185, 0) 100%)',
  },
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '+',
    content: [{ id: 2, text: 'Text 2' }],
    color: 'linear-gradient(135deg, rgb(168, 60, 255) 41%, rgb(235, 0, 123) 71%, rgb(0, 134, 255) 100%)',
  },
];
