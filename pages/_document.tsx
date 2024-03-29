import { Html, Head, Main, NextScript } from "next/document";
import { NavBarHeader } from '@/components/NavBarHeader';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
      <NavBarHeader />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
