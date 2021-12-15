import onChange from 'on-change';
import * as yup from 'yup';
import render from './render';

export default () => {
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
  }, render(elements));

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
      state.form.feedback = 'error';
      state.form.processState = 'error';
    }
  });
};
