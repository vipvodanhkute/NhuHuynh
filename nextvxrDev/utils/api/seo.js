import moment from 'moment';
import request from '#/utils/request';
import { API_ROUTE } from '#/utils/api.routes';

export const payloadToParams = (payload) => {
  const rs = {
    from: payload.from.id,
    to: payload.to.id,
    date: moment(payload.date).toISOString(true),
    companyId: payload.busId,
    lang: payload.lang,
  };
  return rs;
};

export const getSEODataFromAPI = ({
  from, to, date, companyId, lang,
}) => {
  const body = {
    query: `query {  
      seo (from: ${from}, to: ${to}, date: "${date}" ${
  companyId ? `, companyId: ${companyId}` : ''
} , lang: "${lang}") {  
        title  
        metas{  
          name, 
          content,
          property,
        }
        dataStructures,
        links{
          rel
          type
          href,
          hreflang
          title
        }
        richSnippet
        companies {
          id
          name
        }
      }
      
    }`,
  };
  return request({
    url: API_ROUTE.GET_SEO_DATA,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        lang,
      },
    },
  });
};

export const getSEOHomeFromAPI = ({ lang }) => {
  const body = {
    query: `query {  
      seoHome (lang: "${lang}") {  
        title  
        metas{  
          name, 
          content,
          property,
        }
        dataStructures,
        links{
          rel
          type
          href,
          hreflang
          title
        }
      }
    }`,
  };
  return request({
    url: `${API_ROUTE.GET_SEO_DATA}?page=home&lang=${lang}`,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        lang,
      },
    },
  });
};

export const getSEOCompaniesFromAPI = ({
  from, to, date, companyId, lang,
}) => {
  const body = {
    query: `query {  
      seo (from: ${from}, to: ${to}, date: "${date}" ${
  companyId ? `, companyId: ${companyId}` : ''
} , lang: "${lang}") {  
        companies {
          id
          name
        }
      }
    }`,
  };
  return request({
    url: API_ROUTE.GET_SEO_DATA,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        lang,
      },
    },
  });
};

export const getSEOLandingPageFromAPI = ({ lang, slug }) => {
  const body = {
    query: `query {  
      seoLandingPage (lang: "${lang}", slug: "${slug}") {  
        title  
        metas{  
          name, 
          content,
          property,
        }
        dataStructures,
        links{
          rel
          type
          href,
          hreflang
          title
        }
      }
    }`,
  };
  return request({
    url: `${API_ROUTE.GET_SEO_DATA}?lang=${lang}&slug=${slug}`,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        lang,
      },
    },
  });
};

export const getSEOLimousineFromAPI = ({ lang }) => {
  const body = {
    query: `query {  
      seoLimousine (lang: "${lang}") {  
        title  
        metas{  
          name, 
          content,
          property,
        }
        dataStructures,
        richSnippet
        links{
          rel
          type
          href,
          hreflang
          title
        }
      }
    }`,
  };
  return request({
    url: `${API_ROUTE.GET_SEO_DATA}?page=limousine&lang=${lang}`,
    options: {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        lang,
      },
    },
  });
};
