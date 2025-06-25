import TableColumns from './TableColumns';

export default interface DBName {
    name: string;
    tables: TableColumns[];
}
