export function formatDate(date: Date): string {
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    return `${day.toString().length === 1 ? '0' + day : day}/${month.toString().length === 1 ? '0' + month : month}/${date.getFullYear()}`;
}
