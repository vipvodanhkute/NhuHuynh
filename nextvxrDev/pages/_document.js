/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import {
  APPLE_METAS_LINKS,
  SEO_ID as SEO_ID_CONSTANT,
} from '#/utils/constants';


const renderAppleMetas = () => {
  const { metas } = APPLE_METAS_LINKS;
  return metas.map((item, index) => <meta key={index} {...item} />);
}

const renderAppleLinks = () => {
  const { links } = APPLE_METAS_LINKS;
  return links.map((item, index) => <link key={index} {...item} />);
}

export default class ServerDocument extends Document {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context)
    const { req: { locale, localeDataScript, ua } } = context
    const sheet = new ServerStyleSheet()
    const styleTags = sheet.getStyleElement()

    return {
      ...props,
      locale,
      localeDataScript,
      styleTags,
      SEO_ID: ua.isMobile ? SEO_ID_CONSTANT.MOBILE : SEO_ID_CONSTANT.DESKTOP,
    }
  }

  render() {
    // const sheet = new ServerStyleSheet();
    // const main = sheet.collectStyles(<Main />);
    // const styleTags = sheet.getStyleElement();
    const { SEO_ID } = this.props
    const env = `window.ENV = '${process.env.ENV || 'development'}';`;
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${this.props.locale}`;
    return (
      <html lang={this.props.locale}>
        <Head>
          <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.css" as="style" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.css" />
          <meta name="format-detection" content="telephone=no" />
          <link rel="shortcut icon" href="https://vexere.com/images/vexere-ico.ico?v=0.0.3" />
          {renderAppleMetas()}
          {renderAppleLinks()}
          {this.props.styleTags}
          <script
            dangerouslySetInnerHTML={{
              __html: `
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date(); a = s.createElement(o),
          m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
          })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
          // ToDo check init when development
          ga('create', '${SEO_ID.GA_ID}', 'auto'); // Replace with your property ID.
          ga('require', 'displayfeatures');
          ga('require', 'ecommerce');
          ga('send', 'pageview');
        `,
            }}
          />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${SEO_ID.GTM_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${SEO_ID.GTM_ID}');
          dataLayer.push({'language': '${this.props.locale === 'en-US' ? 'en' : 'vi'}', 'platform': 'femobile'})
        `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${SEO_ID.HOTJAR_TRACKING},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
        !function (f, b, e, v, n, t, s) {
          if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
          };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
          n.queue = []; t = b.createElement(e); t.async = !0;
          t.src = v; s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s)
          }(window, document, 'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${SEO_ID.FB_ID}');
          fbq('track', 'PageView');
        `,
            }}
          />
          <noscript
            async
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${SEO_ID.FB_ID}&ev=PageView&noscript=1" />`,
            }}
          />
        </Head>
        <body>
          <noscript async dangerouslySetInnerHTML={{ __html: `<iframe src='https://www.googletagmanager.com/ns.html?id=${SEO_ID.GTM_ID}' height='0' width='0' style='display:none;visibility:hidden;'></iframe>` }} />
          {this.props.customValue}
          {/* {main} */}
          <Main />
          <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript,
            }}
          />
          <script dangerouslySetInnerHTML={{ __html: env }} />
          <NextScript />
        </body>
      </html>
    );
  }
}
