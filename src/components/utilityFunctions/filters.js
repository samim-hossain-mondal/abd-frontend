export function quickFilterSanitizerPONotes(filters) {
  const sanitizedFilters = { ...filters };
  if (sanitizedFilters.date) {
    switch (sanitizedFilters.date) {
      case 'today': {
        sanitizedFilters.startDate = new Date();
        sanitizedFilters.startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'yesterday': {
        sanitizedFilters.startDate = new Date();
        sanitizedFilters.startDate.setDate(sanitizedFilters.startDate.getDate() - 1);
        sanitizedFilters.startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'week': {
        sanitizedFilters.startDate = new Date();
        sanitizedFilters.startDate.setDate(sanitizedFilters.startDate.getDate() - 7);
        sanitizedFilters.startDate.setHours(0, 0, 0, 0);
        sanitizedFilters.endDate = new Date();
        sanitizedFilters.endDate.setHours(0, 0, 0, 0);
        break;
      }
      default: {
        sanitizedFilters.date = undefined;
      }
    }
  }

  return {
    ...sanitizedFilters,
    ...(sanitizedFilters.startDate && {
      startDate: sanitizedFilters.startDate.toISOString(),
    }),
    ...(sanitizedFilters.endDate && {
      endDate: sanitizedFilters.endDate.toISOString()
    })
  };
}

export default { quickFilterSanitizerPONotes };