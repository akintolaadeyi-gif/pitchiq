import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') ?? ''

  if (!path || path.includes('..') || path.includes('//')) {
    return Response.json({ error: 'Invalid path' }, { status: 400 })
  }

  const url = `https://api.sofascore.com/api/v1/${path}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.sofascore.com/',
      'Origin': 'https://www.sofascore.com',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'Cache-Control': 'no-cache',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return Response.json({ error: 'Upstream error', status: res.status }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
