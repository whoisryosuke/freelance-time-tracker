import { format } from 'date-fns'

export const parseDate = (date) => {
  return format(date, 'MMM d, Y')
}

export const parseDay = (date) => {
  return format(date, 'EEEE d')
}

export const parseMonthDate = (date) => {
  return format(new Date(date), 'L/d')
}
