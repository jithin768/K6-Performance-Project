import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com';
const REPORT_DIR = __ENV.REPORT_DIR || '../reports';

export const options = {
  vus: 1,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],         // <1% errors
    http_req_duration: ['p(95)<2000'],      // 95% of requests under 2s
  },
};

export default function () {
  group('Smoke – Home Page', function () {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'page title present': (r) => r.body.includes('Swag Labs'),
    });
  });

  sleep(1);

  /* group('Smoke – Inventory Page', function () {
    const res = http.get(`${BASE_URL}/inventory.html`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  }); 

  sleep(1);*/
}

export function handleSummary(data) {
  return {
    [`${REPORT_DIR}/smoke-report.html`]: htmlReport(data),
  };
}
