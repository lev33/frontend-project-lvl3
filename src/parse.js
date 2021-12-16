export default (data) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data.contents, 'text/xml');
  const error = dom.getElementsByTagName('parsererror');
  if (error.length) {
    const err = new Error(error.textContent);
    err.parseError = true;
    throw err;
  }

  const channelTitle = dom.querySelector('channel > title').textContent;
  const channelDescription = dom.querySelector('channel > description').textContent;
  const channel = { channelTitle, channelDescription };

  const items = [...dom.getElementsByTagName('item')].map((post) => {
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;
    return {
      title,
      link,
      description,
    };
  });

  return { channel, items };
};
