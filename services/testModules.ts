import axios from 'axios';
import { baseUrl } from '../config/config';
import * as data from '../data.json';

const testModules: any = data;

interface ITestModule {
    id?: number,
    name: string,
    isEnabled: boolean,
    testSuiteId: number
};

export const mapTestModules = async function (testSuite: any): Promise<any> {
    let testModules = data.map(x => x.Module);
    let uniqueTestModules = testModules.filter((item, index) => {
        return testModules.indexOf(item) >= index;
    });

    let newTestModules:Array<any> = [];

    for (let i = 0; i < uniqueTestModules.length; i++) {
        let newTestModule = {
            Name: uniqueTestModules[i],
            isEnabled: true,
            testSuiteId: testSuite.id
        };
        const res = await axios.post(`${baseUrl}test-suites/${testSuite.id}/test-modules`, newTestModule);
        newTestModules.push(res.data);
    }

    console.log(newTestModules);
    return newTestModules;
}
