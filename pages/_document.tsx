import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr" className="overflow-hidden">
      <Head>
        <link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v6.3.0/css/pro.min.css" />
        <link rel="shortcut icon" href="/icons/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
