import { EntityTestCase } from '../interfaces/EntityTestCase';

export const entityAccount: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Account',
    attributes: {
        repeatTimes: 8,
        position: 0,
    },
    tables: {
        repeatTimes: 2,
        position: 17,
    },
};

export const entityAddress: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Address',
    attributes: {
        repeatTimes: 7,
        position: 8,
    },
    tables: {
        repeatTimes: 2,
        position: 18,
    },
};

export const entityCustomer: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Customer',
    attributes: {
        repeatTimes: 6,
        position: 15,
    },
    tables: {
        repeatTimes: 2,
        position: 19,
    },
};

export const entityTransaction: EntityTestCase = {
    title: 'should create {{name}} entity',
    name: 'Transaction',
    attributes: {
        repeatTimes: 4,
        position: 21,
    },
    tables: {
        repeatTimes: 2,
        position: 21,
    },
};

export function getAllEntitiesNames(): string[] {
    const entities = [entityAccount, entityAddress, entityCustomer, entityTransaction];

    return entities.map((entity) => entity.name);
}
