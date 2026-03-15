import { Helmet } from "react-helmet-async";

const BASE_URL = "https://skillbridgeintern.org";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

const SEOHead = ({ title, description, path, keywords, noIndex, jsonLd }: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="SkillBridge" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="SkillBridge, Paid Internships for Young Adults" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
        </>
      )}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
