const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

export function JsonLdHome() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Empório Bothânico",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        description: "Loja de perfumes, aromas exclusivos e produtos de banho. Fragrâncias que transformam seu dia a dia.",
        sameAs: ["https://www.instagram.com/emporiobothanicoita/"],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Empório Bothânico",
        image: `${SITE_URL}/logo.png`,
        url: SITE_URL,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Itabira",
          addressRegion: "MG",
          addressCountry: "BR",
        },
        telephone: "+55-31-3831-0866",
        email: "contato@emporiobothanico.com.br",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Empório Bothânico",
        description: "Perfumes, aromas e produtos de banho - Itabira MG",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/produtos?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
