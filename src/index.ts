

/**
 * TestCases
 */
export type TestCases = TestCaseObject[]

/**
 * TestCase object(tuple)
 */
export type TestCaseObject = [
    TestMetaData,
    TestInput,
    TestExpectation,
    TestTarget?
]

/**
 * Test Case Description
 */
export interface TestCaseMetaData {
    name: string;
    description: string;
}
/**
 * Alias Test Case Meta Data
 */
export type TestMetaData = TestCaseMetaData

/**
 * TestInputObject
 */
interface TestInputObject {
    [name: string]: any;
}

type TestInputFunction = () => TestInputValue
type TestInputValue = string | number |  TestInputObject | []

/**
 * Test Input
 */
export type TestInput = TestInputFunction | TestInputValue 

/**
 * Test Expectation
 */
export type TestExpectation = TestCaseExpectedFunction

/**
 * Test Target
 */
export type TestTarget = Function

/**
 * list of mocks
 * 
 */
export interface Mocks {
    [name: string]: () => MockReturn;
}

/**
 * mocked object list
 */
export interface MockReturn {
    [name: string]: jest.SpyInstance;
}

export namespace Mock {
    /**
     * 
     */
    export function SameAs (mocks: Mocks, key: string) {
        return mocks[key]
    }
}

/**
 * Test Case Expected function
 * @param result: result from test target
 * @param spies?: mocked objects at ./mocks.ts
 */
export type TestCaseExpectedFunction = (result: any, spies: MockReturn) => void

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
export const alter = (base: {}, alteration: AlterationParams): {} => {
    const newRequest = Object.assign({}, base)
    const keys = Object.keys(alteration)
    keys.forEach(key => {
        // @ts-ignore
        newRequest[key] = alteration[key]
    })
    return newRequest
}

/**
 * 
 * @param testCase list of the test
 * @param name name of test case(should be matched name of test)
 */
export const sameAs = (testCase: any, name: string): {} => {
    const descriptionIndex = 0
    const requestIndex = 1
    // @ts-ignore
    return testCase.find(
        // @ts-ignore
        c => c[descriptionIndex].name === name
    )[requestIndex]()
}

/**
 * 
 * @param testCase list of the test
 * @param name name of test case(should be matched name of test)
 */
export namespace Request {
    export function sameAs () {
        const descriptionIndex = 0
        const requestIndex = 1
        // @ts-ignore
        return testCase.find(
            // @ts-ignore
            c => c[descriptionIndex].name === name
        )[requestIndex]()
    }    
}

/**
 * Parameter of the Run function
 * Note: testTarget: only accepts Async function
 */
export interface RunningParameter {
    meta: TestCaseMetaData;
    request: {};
    mocks: Mocks;
    testTarget: Function;
    expectation: TestCaseExpectedFunction;
}

/**
 * Dummy Context
 */
export const dummyContext = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'dummy',
    functionVersion: 'dummy',
    invokedFunctionArn: 'dummy',
    memoryLimitInMB: 'dummy',
    awsRequestId: 'dummy',
    logGroupName: 'dummy',
    logStreamName: 'dummy',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {}
}

/**
 * doing the test
 * @param RunningParameter
 */
export function run (params: RunningParameter) {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    const testMeta = params.meta
    it(`${testMeta.name}:${testMeta.description}`, async () => {
        let spies: MockReturn = {}
        if (params.mocks.hasOwnProperty(testMeta.name)) {
            spies = params.mocks[testMeta.name]()
        }

        // @ts-ignore
        const result = (params.testTarget.constructor.name === 'AsyncFunction')
            ? await params.testTarget(params.request)
            : params.testTarget(params.request)
        const expected = params.expectation
        expected(result, spies)
    })
}
