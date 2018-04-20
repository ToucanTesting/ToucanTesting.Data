import axios from 'axios';
import { baseUrl } from '../config/config';
import * as data from '../../data.json';
import * as _ from 'lodash';

const testCases: any = data;

export enum Priority {
    Low = 0,
    Medium,
    High,
    Critical
}

interface ITestCase {
    id?: number,
    description: string,
    isAutomated: boolean,
    isEnabled: boolean,
    priority?: Priority,
    testModuleId: number,
};

export const createTestCases = async function (testModules: any): Promise<any> {
    let newTestCases: ITestCase[] = [];
    let count = 1;
    for (let i = 0; i < testCases.length; i++) {
        const testModule = testModules.find((testModule: any) => testModule.name === testCases[i].component)

        let newTestCase: ITestCase = {
            description: (testCases[i].userAction),
            isAutomated: (testCases[i].automated === "Yes") ? true : false,
            isEnabled: true,
            testModuleId: testModule.id
        }

        if (testCases[i].priority) {
            newTestCase.priority = setPriority(testCases[i].priority);
        }

        try {
            console.log(`${count} - Creating Test Case: ${newTestCase.description}`)
            count++;
            const res = await axios.post(`${baseUrl}test-cases`, newTestCase);
            const newTestCaseResult: any = res.data;
            newTestCases.push(newTestCaseResult);

            if (testCases[i].steps) {
                let testActions: string[] = splitOnNewline(testCases[i].steps);
                for (let i = 0; i < testActions.length; i++) {
                    if (testActions[i].trim().length > 0) {
                        const testAction = {
                            description: testActions[i],
                            sequence: testActions.indexOf(testActions[i]) + 1,
                            testCaseId: newTestCaseResult.id
                        }
                        const res = await axios.post(`${baseUrl}test-actions`, testAction);
                    }
                }
            }

            if (testCases[i].precondition) {
                const testConditions: string[] = splitOnNewline(testCases[i].precondition);
                for (let i = 0; i < testConditions.length; i++) {
                    if (testConditions[i].trim().length > 0) {

                        const testCondition = {
                            description: testConditions[i].replace('* ', ''),
                            testCaseId: newTestCaseResult.id
                        }
                        const res = await axios.post(`${baseUrl}test-conditions`, testCondition);
                    }
                }
            }

            if (testCases[i].expectedResults) {
                const expectedResults: string[] = splitOnNewline(testCases[i].expectedResults);
                for (let i = 0; i < expectedResults.length; i++) {
                    if (expectedResults[i].trim().length > 0) {

                    const expectedResult = {    
                        description: expectedResults[i].replace('* ', ''),
                        testCaseId: newTestCaseResult.id
                    }
                    const res = await axios.post(`${baseUrl}expected-results`, expectedResult);
                }
                    
                }
            }
            console.log(`Created`);
        } catch (error) {
            console.log(error.response)
        }


    }
    return newTestCases;
}

function setPriority(value: string): number {
    let result;
    switch (value) {
        case 'Low':
            result = 0;
            break;
        case 'Medium':
            result = 1;
            break;
        case 'High':
            result = 2;
            break;
        case 'Critical':
            result = 3;
            break;
        default:
            result = 0;
    }
    return result;
}

function splitOnNewline(str: string): string[] {
    let arr = [];
    if (str.indexOf('\n') > -1) {
        arr = str.split('\n');
    } else {
        arr.push(str);
    }
    return arr;
}