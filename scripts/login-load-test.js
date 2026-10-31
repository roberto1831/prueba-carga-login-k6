import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

const BASE_URL = __ENV.BASE_URL || 'https://fakestoreapi.com';
const TPS = Number(__ENV.TPS || 20);
const DURATION = __ENV.DURATION || '3m';
const MAX_RESPONSE_MS = 1500;

const users = new SharedArray('usuarios', function () {
    return open('../data/users.csv')
        .split(/\r?\n/)
        .slice(1)
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const i = line.indexOf(',');
            return { user: line.slice(0, i).trim(), passwd: line.slice(i + 1).trim() };
        });
});

export const options = {
    scenarios: {
        login: {
            executor: 'constant-arrival-rate',
            rate: TPS,
            timeUnit: '1s',
            duration: DURATION,
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
    thresholds: {
        http_req_duration: [`p(95)<${MAX_RESPONSE_MS}`],
        http_req_failed: ['rate<0.03'],
        checks: ['rate>0.97'],
    },
};

export default function () {
    const u = users[exec.scenario.iterationInTest % users.length];

    const res = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({ username: u.user, password: u.passwd }),
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: '60s',
        },
    );

    check(res, {
        'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
        'respuesta incluye token': (r) => {
            try {
                return Boolean(r.json('token'));
            } catch (e) {
                return false;
            }
        },
        'tiempo de respuesta < 1,5 s': (r) => r.timings.duration < MAX_RESPONSE_MS,
    });
}