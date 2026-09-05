import dayjs from 'dayjs'

export function toDateTimeLocal(date: Date): string {
  return dayjs(date).format('YYYY-MM-DDTHH:mm')
}

export function toDateString(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD')
}
