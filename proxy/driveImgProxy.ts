/// <reference types="node" />
import type { ViteDevServer } from 'vite'

export function driveImgProxy() {
  return {
    name: 'drive-img-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/drive-img')) { next(); return }
        const url = new URL(req.url, 'http://localhost')
        const id = url.searchParams.get('id')
        const sz = url.searchParams.get('sz') ?? 'w800'
        if (!id) { next(); return }
        fetch(`https://drive.google.com/thumbnail?id=${id}&sz=${sz}`, { redirect: 'follow' })
          .then(async (upstream) => {
            res.statusCode = upstream.ok ? 200 : upstream.status
            const ct = upstream.headers.get('content-type')
            if (ct) res.setHeader('Content-Type', ct)
            res.setHeader('Cache-Control', 'public, max-age=3600')
            const buf = await upstream.arrayBuffer()
            res.end(Buffer.from(buf))
          })
          .catch(() => { res.statusCode = 502; res.end() })
      })
    },
  }
}
