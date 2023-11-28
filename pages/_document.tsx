import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="overflow-hidden">
      <Head>
        {/* <link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v6.4.2/css/pro.min.css" /> */}
        <link rel="shortcut icon" href="/icons/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
