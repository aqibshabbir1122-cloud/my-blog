'use client'

export default function AdBanner728() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '60e4236c44b94a24cab74af2793745f3',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/60e4236c44b94a24cab74af2793745f3/invoke.js"></script>
      </body>
    </html>
  `

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden">
      <iframe
        title="ad-728x90"
        srcDoc={adHtml}
        width={728}
        height={90}
        className="border-0 overflow-hidden max-w-full"
        scrolling="no"
      />
    </div>
  )
}