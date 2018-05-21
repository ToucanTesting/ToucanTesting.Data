import axios from 'axios';
import { baseUrl } from '../config/config';

let testSuites = [
    {
        name: "Kno2fy"
    },
    {
        name: "Kno2fy Smoke"
    },
    {
        name: "Kno2fy Penetration"
    }
];

export const createTestSuites = async function (): Promise<any> {
    const current = await axios.get(`${baseUrl}test-suites`);

    if (current.data.length <= 0) {
        for (let i = 0; i < testSuites.length; i++) {
            const res = await axios.post(`${baseUrl}test-suites`, testSuites[i]);
            testSuites[i] = res.data;
        }
    } else {
        testSuites = current.data;
    }

    return testSuites;
};
