import axios from 'axios';
import { token } from './config/config';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

import { createTestSuites } from './services/testSuites';
import { mapTestModules } from './services/testModules';
import { createTestCases } from './services/testCases';

async function start(): Promise<void> {
    const testSuite = await createTestSuites().catch(err => console.log(err.message));
    const testModules = await mapTestModules(testSuite);
    const testCases = await createTestCases(testModules);
}

start();