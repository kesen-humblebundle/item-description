import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { generatePhrase, generateSentence, getRandomInRange } from '../../db/data-gen/utils.js';
import genres from '../../db/data-gen/genres.js';

// Track various error rate(s)
let errorRate = new Rate('errorRate');

let params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// 10 VUs, each needs to achieve 100 RPS (since 1 user achieving 1000 RPS seems a bit beyond PC capabilities)
export let options = {
  rps: 1000,
  vus: 20,
  duration: '1m'
};

export default function() {
  let payload = JSON.stringify({
    title: generatePhrase(true),
    description: generateSentence(),
    genres: [ genres[getRandomInRange(0, genres.length - 1)] ]
  });

  let response = http.post(`http://localhost:3003/description/`, payload, params);

  check(response, {
    'code 201': (r) => (r.status === 201)
  });

  errorRate.add(response.status >= 400);
}
