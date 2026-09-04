'use client'

interface AdBanner300x250Props {
  className?: string
}

export default function AdBanner300x250({ className = '' }: AdBanner300x250Props) {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <base href="https://wanderline.site/" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 300px;
            height: 250px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
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
    <div className={`w-full flex justify-center my-4 overflow-hidden ${className}`}>
      <iframe
        title="Advertisement"
        srcDoc={adHtml}
        width={300}
        height={250}
        scrolling="no"
        className="border-0 overflow-hidden w-[300px] h-[250px]"
      />
    </div>
  )
}