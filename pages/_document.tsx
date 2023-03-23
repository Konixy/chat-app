import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { WithNextUI } from '../../NextUITailwind';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang="fr">
        <Head>
          <link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v6.3.0/css/pro.min.css" />
          <link rel="shortcut icon" href="/icons/favicon.ico" type="image/x-icon" />
        </Head>
        <body>
          <WithNextUI>
            <Main />
            <NextScript />
          </WithNextUI>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
