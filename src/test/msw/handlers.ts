import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/functions/v1/gemini-rag', async () => {
    return HttpResponse.json({
      answer: 'Mocked grounded answer from MSW.',
      confidence: 0.88,
      sources: [{ id: 'sop1', type: 'sop', title: 'HEM-SOP-001 - FBC Analysis' }],
    });
  }),
];

