const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'error':
      elements.btnAdd.disabled = false;
      elements.input.readOnly = false;
      break;

    case 'loading':
      elements.btnAdd.disabled = true;
      elements.input.readOnly = true;
      break;

    case 'filling':
      elements.btnAdd.disabled = false;
      elements.input.readOnly = false;
      elements.input.value = '';
      elements.input.focus();
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const handleFormState = (elements, value) => {
  if (value) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
  }
};

const handleFeedback = (elements, value, i18nextInstance) => {
  elements.feedback.textContent = i18nextInstance.t(`form.feedback.${value}`);
};

const handleFeeds = (elements, feeds, i18nextInstance) => {
  if (!feeds.length) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  container.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nextInstance.t('feeds.header')}</h2</div>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((channel) => {
    const { channelTitle, channelDescription } = channel;
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = channelTitle;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = channelDescription;
    li.append(h3, p);
    ul.prepend(li);
  });
  container.append(ul);
  elements.feeds.innerHTML = '';
  elements.feeds.append(container);
};

const handlePosts = (elements, posts, i18nextInstance) => {
  if (!posts.length) {
    return;
  }
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  container.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18nextInstance.t('posts.header')}</h2</div>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const {
      title, link, postId, viewed,
    } = post;

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add(viewed ? ('fw-normal', 'link-secondary') : 'fw-bold');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('data-id', `${postId}`);
    a.href = link;
    a.textContent = title;

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.setAttribute('data-id', `${postId}`);
    btn.textContent = i18nextInstance.t('posts.btnPreview');

    li.append(a, btn);
    ul.prepend(li);
  });
  container.append(ul);
  elements.posts.innerHTML = '';
  elements.posts.append(container);
};

const handleModal = (elements, post) => {
  elements.modal.querySelector('.modal-title').textContent = post.title;
  elements.modal.querySelector('.modal-body').textContent = post.description;
  elements.modal.querySelector('.full-article').href = post.link;
};

export default (elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.valid':
      handleFormState(elements, value);
      break;

    case 'form.feedback':
      handleFeedback(elements, value, i18nextInstance);
      break;

    case 'feeds':
      handleFeeds(elements, value, i18nextInstance);
      break;

    case 'posts':
      handlePosts(elements, value, i18nextInstance);
      break;

    case 'previewPost':
      handleModal(elements, value);
      break;

    default:
      break;
  }
};
