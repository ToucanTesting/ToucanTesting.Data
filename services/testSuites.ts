import axios from 'axios';
import { baseUrl } from '../config/config';
import * as data from '../data.json';

export const createTestSuites = async function (): Promise<any> {
    const testSuite: any = {};
    testSuite.Name = data[0].Suite;
    const res = await axios.post(`${baseUrl}test-suites`, testSuite);

    return res.data;
};
