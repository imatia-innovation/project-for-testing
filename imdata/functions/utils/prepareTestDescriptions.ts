import { TestCase } from '../../interfaces/TestCase';

export function prepareTestDescriptions(testCase: TestCase): string {
    const username: string = testCase.user.credentials.email.split('@')[0];

    const testDescription = testCase.testDescription
        .replace('{{username}}', username)
        .replace('{{role}}', testCase.user.credentials.role);

    return testDescription;
}
