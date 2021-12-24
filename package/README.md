# jest-simple-template

# concepts
The concept of this template is to make closely test code to test document.
So In this template, We use the describe.each method to define test code.
The describe each is one of the jest feature.

https://jestjs.io/docs/en/api#describeeachtablename-fn-timeout

There are 2 principals

# [Principal1] Meaning of table indexes
The describe.each accepts test cases as table.
This template gives meanings to each index below.

**index[0] - Object: Description of the test**  
**index[1] - Object: Input of the test**  
**index[2] - Function: Validate expectation of the test**  


# [Principal2] Mocking Convention
This template automatically call mocks in a mock file.
Test method calls the mock definition which is matched the name of the test description(=index[0])

# Usage
To use this template, there are 2 steps for preparation.


## 1. Generate template
First, generate template by the generate_test_case command
```
generate_test_case <<category>> <<name of the test>>
```

This command generates mocks and test template in the __tests__ folder.

```
+- <<root of the project>>  
  +- __tests__  
    +- <<category>>  
      +- <<name>>.test.ts  
      +- mocks.ts  
```

**Important: currently, generator creates files only the __tests__ folder of project root.**

## 2. Import target method
Import target method in the test file

in the test file, 

```javascript

import handler from '../src/target' <---- importing function you want to test

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
            name: 'OK',
            description: 'should return succeeded response'
        },
        // [1]: request
        request,
        // [2]: expected
        (result: {}) => {
            expect(result).toBe(1)
        }
    ],
    [
        // [0]: description
        {
            name: 'Duplicated',
            description: 'should return duplicate something error'
        },
        // [1]: request
        request,
        // [2]: expected
        (result: {}) => {
            expect(result).toBe('error')
        }
    ]
]

describe.each(testCase)('Publish state', (d, r, e) => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    const testMeta = d as TestCaseMetaData
    it(`${testMeta.name}:${testMeta.description}`, async () => {
        if (mocks.hasOwnProperty(testMeta.name)) {
            mocks[testMeta.name]()
        }

        // @ts-ignore
        const result = await handler(r)
        const expected = e as (result: any) => void
        expected(result)
    })
})
```

# Define mocks

You can define mock functions. Key has matched the name of test.

```javascript
const mocks: Mocks = {
    OK: () => {
      // write the code of mocking some objects
    },
    Duplicated: () => {
      // write the code of mocking some objects
    }
}

export default mocks

```

Mock "OK" function will be called when the "OK" test case run.

```javascript
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
            name: 'OK',
            description: 'should return succeeded response'
        },
        // [1]: request
        request,
        // [2]: expected
        (result: {}) => {
            expect(result).toBe(1)
        }
    ],
    [
        // [0]: description
        {
            name: 'Duplicated',
            description: 'should return duplicate something error'
        },
        // [1]: request
        request,
        // [2]: expected
        (result: {}) => {
            expect(result).toBe('error')
        }
    ]
]

describe.each(testCase)('Publish state', (d, r, e) => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    const testMeta = d as TestCaseMetaData
    it(`${testMeta.name}:${testMeta.description}`, async () => {
        if (mocks.hasOwnProperty(testMeta.name)) {
            mocks[testMeta.name]()
        }

        // @ts-ignore
        const result = await handler(r)
        const expected = e as (result: any) => void
        expected(result)
    })
})
```

# Exported types and utilities

```javascript
/// <reference types="jest" />
/**
 * list of mocks
 *
 */
export interface Mocks {
    [name: string]: () => {
        [name: string]: jest.SpyInstance;
    };
}
/**
 * mocked object list
 */
export interface MockReturn {
    [name: string]: jest.SpyInstance;
}
/**
 * Test Case Description
 */
export interface TestCaseMetaData {
    name: string;
    description: string;
}
/**
 * Test Case Expected function
 * @param result: result from test target
 * @param spies: mocked objects at ./mocks.ts
 */
export declare type TestCaseExpectedFunction = (result: {}, spies: MockReturn) => void;
/**
 * alter test input
 * only input is object
 * It's not supported nested key
 */
export interface AlterationParams {
    [name: string]: any;
}
/**
 * input alteration
 * @param base based object
 * @param alteration alter parameter
 */
export declare const alter: (base: {}, alteration: AlterationParams) => {};
/**
 *
 * @param testCase list of the test
 * @param name name of test case(should be matched name of test)
 */
export declare const sameAs: (testCase: any, name: string) => {};

```
