import { createProxyMiddleware } from 'http-proxy-middleware';
import { getIndexHtml } from '@/utils/get-static';

const getHomePage = async () => {
  const html = await getIndexHtml('index.html');
  return html;
};

export const proxyToBing = createProxyMiddleware({
  target: 'https://www.bing.com',
  pathRewrite() {
    return '/';
  },
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true,
  proxyTimeout: 5000,
  onProxyRes: async (proxyRes, req, res) => {
    if (proxyRes.statusCode >= 500) {
      const html = await getHomePage();
      res.status(200).end(html);
      return;
    }
    const headers = proxyRes.headers;
    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]);
    });
    const chunks: Buffer[] = [];
    proxyRes.on('data', (chunk) => {
      chunks.push(chunk);
    });
    proxyRes.on('end', () => {
      return res.end(Buffer.concat(chunks));
    });
  },
  onError: async (err, req, res) => {
    const html = await getHomePage();
    res.status(200).end(html);
  },
});
