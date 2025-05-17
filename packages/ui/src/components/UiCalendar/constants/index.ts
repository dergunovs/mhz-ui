import { ICalendarEvent } from '../interface';

export const EVENTS: ICalendarEvent<object>[] = [
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '24',
    content: [{ id: 1, text: 'Text' }],
    color:
      'linear-gradient(135deg, rgb(196, 30, 58) 35%, rgb(218, 112, 214) 35%, rgb(218, 112, 214) 68%, rgb(255, 140, 0) 68%, rgb(255, 140, 0) 100%)',
  },
  {
    id: 'id of event',
    start: new Date(),
    end: new Date(),
    title: '32',
    content: [{ id: 2, text: 'Text 2' }],
    color:
      'linear-gradient(135deg, rgb(255, 140, 0) 37%, rgb(196, 30, 58) 37%, rgb(196, 30, 58) 71%, rgb(50, 205, 50) 71%, rgb(50, 205, 50) 100%)',
  },
];
