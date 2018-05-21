import axios from 'axios';
import { baseUrl } from '../config/config';
import * as data from '../../data.json';

const testModules: any = data;

interface ITestModule {
    id?: number,
    name: string,
    isEnabled: boolean,
    testSuiteId: number
};

export const mapTestModules = async function (testSuites: any): Promise<any> {
    let newTestModules: ITestModule[] = [];

    for (let i = 0; i < testModules.length; i++) {
        let testSuiteId;
        let testSuite;
        let testModuleExists = newTestModules.find((testModule) => testModule.name === testModules[i].component);
        
        if (!!testModuleExists) {
            continue;
        } else {
            if (testModules[i].component === "Smoke (Critical)") {
            testSuite = testSuites.find((testSuite: any) => testSuite.name === "Kno2fy Smoke");
            } else if (testModules[i].component === "Penetration Tests") {
                testSuite = testSuites.find((testSuite: any) => testSuite.name === "Kno2fy Penetration");
            } else {
                testSuite = testSuites.find((testSuite: any) => testSuite.name === "Kno2fy")
            }
            testSuiteId = testSuite.id;

            let newTestModule: ITestModule = {
                name: testModules[i].component,
                isEnabled: true,
                testSuiteId: testSuiteId
            }

            console.log(newTestModule.name)
            const res = await axios.post(`${baseUrl}test-suites/${testSuiteId}/test-modules`, newTestModule);
            newTestModules.push(res.data);
        }
    }
    return newTestModules
}
