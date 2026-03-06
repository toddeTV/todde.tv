/**
 * Returns a reactive ISO date string (YYYY-MM-DD) for "today".
 * Uses `useState` so server and client agree during hydration.
 * After hydration the value is updated to the actual client date.
 */
export function useTodayDate() {
  const today = useState('today-date', () => localDateString())

  if (import.meta.client) {
    onMounted(() => {
      today.value = localDateString()
    })
  }

  return today
}

/** Builds a YYYY-MM-DD string from the local calendar date. */
function localDateString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
