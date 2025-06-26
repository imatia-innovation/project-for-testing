import { EntityTestCase } from '../interfaces/EntityTestCase';

export const entityAccount: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Account',
    attributes: {
        repeatTimes: 10,
        position: 0,
    },
    tables: {
        repeatTimes: 3,
        position: 18,
    },
};

export const entityAddress: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Address',
    attributes: {
        repeatTimes: 7,
        position: 10,
    },
    tables: {
        repeatTimes: 3,
        position: 21,
    },
};

export const entityCustomer: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Customer',
    attributes: {
        repeatTimes: 6,
        position: 17,
    },
    tables: {
        repeatTimes: 3,
        position: 22,
    },
};

export const entityTransaction: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Transaction',
    attributes: {
        repeatTimes: 5,
        position: 23,
    },
    tables: {
        repeatTimes: 3,
        position: 23,
    },
};

export function getAllEntitiesNames(): string[] {
    const entities = [entityAccount, entityAddress, entityCustomer, entityTransaction];

    return entities.map((entity) => entity.name);
}
