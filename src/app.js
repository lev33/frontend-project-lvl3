import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import render from './render';
import resources from './locales/resources';

const app = (i18nextInstance) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    btnAdd: document.getElementById('btnAdd'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };
  const state = onChange({
    form: {
      valid: false,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {
        url: '',
      },
      feedback: null,
    },
    urls: [],
    feeds: [],
    posts: [],
  }, render(elements, i18nextInstance));

  const validate = (sourceUrl) => yup.string().required().url().notOneOf(state.urls)
    .validate(sourceUrl)
    .catch((err) => {
      throw err;
    });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const sourceUrl = formData.get('url');
    try {
      await validate(sourceUrl);
      state.form.valid = true;
      state.form.feedback = null;
      state.form.processState = 'loading';
      //       const data = await getFeed(sourceUrl);
      state.form.processState = 'filling';
      state.urls.push(sourceUrl);
      state.form.feedback = 'success';
    } catch (err) {
      state.form.valid = false;
      state.form.feedback = err.type;
      state.form.processState = 'error';
    }
  });
};

export default async () => {
  const i18nextInstance = i18next.createInstance({
    lng: 'ru',
    resources,
  });
  await i18nextInstance.init();
  app(i18nextInstance);
};
