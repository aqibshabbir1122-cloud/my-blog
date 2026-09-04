'use client'

interface AdBanner300x250Props {
  className?: string
}

export default function AdBanner300x250({ className = '' }: AdBanner300x250Props) {
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
            'key' : '92fb45cee330c56f2914966ceaa656d6',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/92fb45cee330c56f2914966ceaa656d6/invoke.js"></script>
      </body>
    </html>
  `

  return (
    <div className={`w-full flex justify-center my-6 overflow-hidden ${className}`}>
      <iframe
        title="ad-300x250"
        srcDoc={adHtml}
        width={300}
        height={250}
        className="border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  )
}