import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com';

const users = new SharedArray('users', function () {
  return papaparse.parse(open('../data/users.csv'), { header: true }).data;
});

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // ramp up to 10 VUs
    { duration: '3m', target: 10 },   // hold at 10 VUs
    { duration: '1m', target: 0 },    // ramp down
  ],

  thresholds: {
    http_req_failed: ['rate<0.05'],       // <5% errors
    http_req_duration: ['p(95)<1000'],    // 95% under 1 second
    http_req_duration: ['p(99)<2000'],    // 99% under 2 seconds
  },
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  group('Load – Inventory Page', function () {
    const res = http.get(`${BASE_URL}/inventory.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'inventory loaded': (r) => r.body.includes('inventory_list'),
    });
    sleep(1);
  });

  group('Load – Cart Page', function () {
    const res = http.get(`${BASE_URL}/cart.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(1);
  });

  group('Load – Checkout Page', function () {
    const res = http.get(`${BASE_URL}/checkout-step-one.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    '../reports/load-report.html': htmlReport(data),
  };
}
