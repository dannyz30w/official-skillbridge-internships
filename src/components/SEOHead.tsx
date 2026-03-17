import { Helmet } from "react-helmet-async";

const BASE_URL = "https://skillbridgeintern.org";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: object | object[];
}

const breadcrumbSchema = (path: string, title: string) => {
  const parts = path.split("/").filter(Boolean);
  const itemListElement = [{ "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` }];
  parts.forEach((part, i) => {
    const joined = `/${parts.slice(0, i + 1).join("/")}`;
    itemListElement.push({ "@type": "ListItem", position: i + 2, name: part.replace(/-/g, " "), item: `${BASE_URL}${joined}` });
  });
  if (parts.length === 0) {
    itemListElement.push({ "@type": "ListItem", position: 2, name: title, item: `${BASE_URL}${path}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement };
};

const SEOHead = ({ title, description, path, keywords, noIndex, jsonLd }: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  const combinedJsonLd = [breadcrumbSchema(path, title), ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="SkillBridge" />
      <meta name="category" content="Employment, Internships, Career Development" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      {combinedJsonLd.map((schema, idx) => (
        <script key={idx} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
