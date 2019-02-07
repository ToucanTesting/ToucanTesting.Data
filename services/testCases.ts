import axios from 'axios';
import { baseUrl } from '../config/config';
import * as data from '../data.json';
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
    lastTested?: Date | null,
    hasCriteria: boolean
};

export const createTestCases = async function (testModules: any): Promise<any> {
    let newTestCases: ITestCase[] = [];
    let count = 1;

    console.log(`Importing ${testCases.length} Test Cases`);
    for (let i = 0; i < testCases.length; i++) {
        const testModule = testModules.find((testModule: any) => testModule.name === testCases[i].Module);


        let newTestCase: ITestCase = {
            description: testCases[i].Case.replace("* ", ""),
            isAutomated: (testCases[i].Automated === "Yes") ? true : false,
            isEnabled: true,
            testModuleId: testModule.id,
            lastTested: (testCases[i]["Last Tested"]) ? new Date(testCases[i].lastTested) : null,
            hasCriteria: (testCases[i].Criteria === "Yes") ? true : false,
            priority: testCases[i].Priority
        };

        try {
            console.log(`${count} - Creating Test Case: ${newTestCase.description}`)
            count++;
            const res = await axios.post(`${baseUrl}test-cases`, newTestCase);
            const newTestCaseResult: any = res.data;
            newTestCases.push(newTestCaseResult);

            if (testCases[i].Steps) {
                const testActions: string[] = testCases[i].Steps.split('* ');
                for (let i = 0; i < testActions.length; i++) {
                    if (testActions[i].trim().length > 0) {
                        const testAction = {
                            description: testActions[i].replace('* ', ''),
                            sequence: testActions.indexOf(testActions[i]) + 1,
                            testCaseId: newTestCaseResult.id
                        }
                        const res = await axios.post(`${baseUrl}test-actions`, testAction);
                    }
                }
            }

            if (testCases[i].Conditions) {
                const testConditions: string[] = testCases[i].Conditions.split('* ');
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

            if (testCases[i]["Expected Results"]) {
                const expectedResults: string[] = testCases[i]["Expected Results"].split('* ');
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
            console.log(error)
        }


    }
    return newTestCases;
}

function splitOnNewline(str: string): string[] {
    let arr:Array<string> = [];
    if (str.indexOf('\n') > -1) {
        arr = str.split('\n');
    } else {
        arr.push(str);
    }
    return arr;
}