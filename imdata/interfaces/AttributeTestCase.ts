export interface SelectColumns {
    dbName: string;
    tableName: string;
    columnName: string;
}

export interface AttributeTestCase {
    title: string;
    name: string;
    assistedSearch: boolean;
    selectColumns: SelectColumns[];
}
