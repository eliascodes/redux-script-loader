export const appendScriptTag = (doc, { src, async }) => {
  const script = doc.createElement('script');

  script.type = 'application/javascript';
  script.src = src;
  script.async = async;

  doc.querySelector('body').appendChild(script);
};

export const getScriptAttributes = ({ payload, async }) => ({
  src: payload,
  async: typeof async !== 'undefined' ? async : true,
});

export const getLoadingCheck = (action) => action.check || (() => Promise.resolve());
