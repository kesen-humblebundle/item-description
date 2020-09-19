/**
 * NOTE: Since this script is fairly similar between GET routes /, /genre/:product_id, /description/title/:product_id, /description/:product_id,
 * I won't be writing other scripts for those other GET routes. Instead, snippets can be commented in or out below to test different routes.
 * This is an internal tool which I'll probably be using rarely, so no need to worry about polish.
 */

import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Track error rate, product_ids hit (between 9e6 and 1e7)
let errorRate = new Rate('errorRate');
let productIdEndpoints = new Trend('endpointIds'); // Comment out for root route test

// 10 VUs, each needs to achieve 100 RPS (since 1 user achieving 1000 RPS seems a bit beyond PC capabilities)
export let options = {
  rps: 1000,
  vus: 10,
  duration: '1m'
};

export default function() {
  let randProductId = Math.floor(Math.random() * 1e6) + 9e6; // Comment out for root route test

  // Comment in/out depending on endpoint desired:
  let response = http.get(`http://localhost:3003/genre/${randProductId}`);
  // let response = http.get(`http://localhost:3003/description/title/${randProductId}`);
  // let response = http.get(`http://localhost:3003/description/${randProductId}`);
  // let response = http.get(`http://localhost:3003/`);

  check(response, {
    'code 200': (r) => r.status === 200
  });

  errorRate.add(response.status >= 400);
  productIdEndpoints.add(randProductId); // Comment out for root route test
}
