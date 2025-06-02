/**
 * Build date filter for created_at field
 * @param dateInput - Date string or Date object
 * @returns Object with startDate and endDate in ISO format or null if invalid
 */
export const buildDateFilter = (
  dateInput: string | Date,
): { startDate: string; endDate: string } | null => {
  try {
    const startDate = new Date(dateInput);
    const endDate = new Date(dateInput);

    // Validate date
    if (isNaN(startDate.getTime())) {
      return null;
    }

    // Set time range for the entire day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return null;
  }
};
