export const sortByDateDescending = <T>(arr: T[], property: keyof T): T[] => {
  return arr.slice().sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    const dateA =
      typeof aValue === "string" || typeof aValue === "number"
        ? new Date(aValue)
        : null;
    const dateB =
      typeof bValue === "string" || typeof bValue === "number"
        ? new Date(bValue)
        : null;

    if (
      !(dateA instanceof Date) ||
      isNaN(dateA.getTime()) ||
      !(dateB instanceof Date) ||
      isNaN(dateB.getTime())
    ) {
      throw new Error("Invalid date property");
    }

    return dateB.getTime() - dateA.getTime();
  });
};
