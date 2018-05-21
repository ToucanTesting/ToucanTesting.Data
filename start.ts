import axios from 'axios';
import { token } from './config/config';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

import { createTestSuites } from './services/testSuites';
import { mapTestModules } from './services/testModules';
import { createTestCases } from './services/testCases';

async function start(): Promise<void> {
    const testSuites = await createTestSuites().catch(err => console.log(err));
    const testModules = await mapTestModules(testSuites).catch(err => console.log(err));
    const testCases = await createTestCases(testModules).catch(err => console.log(err));
}

start();