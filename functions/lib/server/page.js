function page ({ html, state, title }) {
  return `
    <!DOCTYPE html>
    <html>

    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="version" content="3bc8997a6d36bc643c21" />
      <title>PixelBots</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link rel="stylesheet" href="/tomorrow.css">
      <link href="/style.css" rel="stylesheet" />
      <link rel="icon" type="image/x-icon" href="/images/favicon.ico?v=2">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js"></script>
    </head>

    <body>
      <div id="app">${html}</div>
      <script>hljs.initHighlightingOnLoad()</script>
    <script type="text/javascript" src="/public/3bc8997a6d36bc643c21.worker.js"></script><script type="text/javascript" src="/public/3bc8997a6d36bc643c21.vendor.js"></script><script type="text/javascript" src="/public/3bc8997a6d36bc643c21.app.js"></script></body>

    </html>
  `
}

export default page
