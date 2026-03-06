/**
 * Returns a reactive ISO date string (YYYY-MM-DD) for "today".
 * Uses `useState` so server and client agree during hydration.
 * After hydration the value is updated to the actual client date.
 */
export function useTodayDate() {
  const today = useState('today-date', () =>
    new Date().toISOString().slice(0, 10),
  )

  if (import.meta.client) {
    onMounted(() => {
      today.value = new Date().toISOString().slice(0, 10)
    })
  }

  return today
}
