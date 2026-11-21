/** Health check for hosting / uptime monitoring: GET /api/health */
export function GET() {
  return Response.json({ status: 'ok' });
}
