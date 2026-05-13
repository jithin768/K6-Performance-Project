import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com';

export const options = {
  stages: [
    { duration: '2m', target: 20 },   // ramp up to normal load
    { duration: '5m', target: 20 },   // hold normal load
    { duration: '2m', target: 50 },   // spike beyond normal
    { duration: '5m', target: 50 },   // hold high load
    { duration: '2m', target: 80 },   // push to peak
    { duration: '5m', target: 80 },   // hold peak load
    { duration: '2m', target: 0 },    // ramp down
  ],

  thresholds: {
    http_req_failed: ['rate<0.10'],       // <10% errors tolerated under stress
    http_req_duration: ['p(95)<3000'],    // 95% under 3 seconds
  },
};

export default function () {
  group('Stress – Home Page', function () {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.5);
  });

  group('Stress – Inventory Page', function () {
    const res = http.get(`${BASE_URL}/inventory.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'page not empty': (r) => r.body.length > 0,
    });
    sleep(0.5);
  });

  group('Stress – Cart Page', function () {
    const res = http.get(`${BASE_URL}/cart.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.5);
  });
}

export function handleSummary(data) {
  return {
    'reports/stress-report.html': htmlReport(data),
  };
}
