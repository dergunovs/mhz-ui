import { ICalendarEvent } from '../interface';

export const LANG = 'ru';

export const EVENTS: ICalendarEvent<object>[] = [
  {
    id: 'id of event 1',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    title: '24',
    content: [{ id: 1, text: 'Text' }],
    color:
      'linear-gradient(135deg, rgb(196, 30, 58) 35%, rgb(218, 112, 214) 35%, rgb(218, 112, 214) 68%, rgb(255, 140, 0) 68%, rgb(255, 140, 0) 100%)',
  },
  {
    id: 'id of event 2',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    title: '32',
    content: [{ id: 2, text: 'Text 2' }],
    color:
      'linear-gradient(135deg, rgb(255, 140, 0) 37%, rgb(196, 30, 58) 37%, rgb(196, 30, 58) 71%, rgb(50, 205, 50) 71%, rgb(50, 205, 50) 100%)',
  },
];
