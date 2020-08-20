#!/usr/bin/env node

'use strict';

const fs = require("fs");
const uuidv4 = require("uuidv4");

/**
 *
 * @param name name of test
 * @param resultType result type definition of target function
 */
exports.testTemplate = (name = 'Succeeded', resultType = '{}') => {
    return `
import { TestCaseMetaData, MockReturn, TestCaseExpectedFunction } from 'jest-simple-template'
import mocks from './mocks'

let input = {}

/**
 * Test Case Definition
 *
 * [0]: test description
 * [1]: request(input)
 * [2]: expect(output)
 */
const testCase = [
    [
        // [0]: description
        {
            name: '${name}',
            description: 'description of test'
        },
        // [1]: input of the test
        input,
        // [2]: expected
        (result: ${resultType}, spies: MockReturn = undefined) => {
        }
    ]
]

describe.each(testCase)('Test name', (d, r, e) => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    const testMeta = d as TestCaseMetaData
    it(\`\${testMeta.name}:\${testMeta.description}\`, async () => {
        let spies: MockReturn = {}
        if (mocks.hasOwnProperty(testMeta.name)) {
            spies = mocks[testMeta.name]()
        }

        // @ts-ignore
        const result = await handler(r)
        const expected = e as TestCaseExpectedFunction
        expected(result, spies)
    })
})
`;
};
/**
 *
 * @param name mock template name
 */
const mockTemplate = (name) => {
    return `    
import { Mocks } from 'jest-simple-template'

const mocks: Mocks = {
    '${name}': () => {
        // ToDo: write mock code if needed
    },
}

export default mocks
    `;
};
/**
 * Generate test set
 * @param testCaseDirectory path to save directory
 * @param name name of test
 */
const generate = (testCaseDirectory, name) => {
    const dist = `__tests__/${testCaseDirectory}`;
    console.log(dist);
    const dir = fs.mkdirSync(`__tests__/${testCaseDirectory}`, { recursive: true });
    console.log(dir);
    const f1 = fs.writeFileSync(`${dist}/${name}.test.ts`, exports.testTemplate(name));
    const f2 = fs.writeFileSync(`${dist}/mocks.ts`, mockTemplate(name));
    return '';
};
const category = (process.argv[2]) ? process.argv[2] : `test-${uuidv4.uuid().slice(0, 8)}`;
console.log('directory:', category);
const name = (process.argv[3]) ? process.argv[3] : `case-${uuidv4.uuid().slice(0, 8)}`;
console.log('file:', name);
generate(category, name);
