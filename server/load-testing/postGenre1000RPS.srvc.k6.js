import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { getRandomInRange } from '../../db/data-gen/utils.js';
import genres from '../../db/data-gen/genres.js';

// Track various error rate(s), product_ids hit (between 9e6 and 1e7)
let errorRate = new Rate('errorRate');
let productIdEndpoints = new Trend('endpointIds');

let params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// 10 VUs, each needs to achieve 100 RPS (since 1 user achieving 1000 RPS seems a bit beyond PC capabilities)
export let options = {
  rps: 1000,
  vus: 30,
  duration: '1m'
};

export default function() {
  let randProductId = Math.floor(Math.random() * 1e6) + 9e6; // Comment out for description route test

  // Genre payload: 1 genre (genre might already exist, so code 201 or 400 are possible expected)
  let payload = JSON.stringify({
    genre: genres[getRandomInRange(0, genres.length - 1)]
  });

  let response = http.post(`http://localhost:3003/genre/${randProductId}`, payload, params);

  check(response, {
    'validGenres send in response if code 400, otherwise code 201': (r) => (r.status === 201 || r.status === 400 && JSON.parse(r.body).validGenres)
  });

  errorRate.add(response.status > 400); // For genres endpoint, 400 errors may be expected when invalid genres or genres that already exist are posted
  productIdEndpoints.add(randProductId);
}
