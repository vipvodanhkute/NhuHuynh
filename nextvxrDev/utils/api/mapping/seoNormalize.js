export const generateRichSnippet = (dataResponse) => {
  const rs = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  }
  if (dataResponse.breadcrumbs) {
    rs.itemListElement = dataResponse.breadcrumbs.levels.map((level, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': level.url,
        name: level.name,
        image: level.image,
      },
    }))
  }
  return rs;
}
