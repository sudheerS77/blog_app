import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* <script type="text/javascript">
          var Tawk_API=Tawk_API||{ }
          var Tawk_LoadStart=new Date();
          function one(){
            let s1 = document.createElement("script");
            let s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/63fa22b04247f20fefe29b85/1gq4hf0oa';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);  
          }
        </script> */}
{/* <script type="text/javascript">
let Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function() {
            let s1=document.createElement("script");
          let s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/63fa22b04247f20fefe29b85/1gq4hf0oa';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
}
          )();
</script> */}
      </body>
    </Html>
  );
}
