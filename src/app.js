import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId, differenceBy } from 'lodash';
import render from './render';
import resources from './locales/resources';
import parse from './parse';

const app = (i18nextInstance) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    btnAdd: document.getElementById('btnAdd'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: document.getElementById('modal'),
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
    previewPost: null,
  }, render(elements, i18nextInstance));

  const proxify = (url) => {
    const proxy = new URL('https://allorigins.hexlet.app/get?disableCache=true&url=');
    proxy.searchParams.set('url', url);
    return proxy;
  };

  const addId = (posts, feedId) => posts.map((post) => {
    const postId = uniqueId();
    return {
      ...post, postId, feedId, viewed: false,
    };
  });

  const updateFeed = (sourceUrl, feedId) => {
    setTimeout(() => {
      axios.get(proxify(sourceUrl))
        .then((response) => {
          const { items } = parse(response.data);
          const newItems = differenceBy(items, state.posts, 'link');

          if (newItems.length) {
            const newPosts = addId(newItems, feedId);
            state.posts.push(...newPosts.reverse());
          }
        })
        .then(() => {
          updateFeed(sourceUrl, feedId);
        });
    }, 5000);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const sourceUrl = formData.get('url');

    const schema = yup.string().required().url().notOneOf(state.urls);

    schema.validate(sourceUrl)
      .then(() => {
        state.form.valid = true;
        state.form.feedback = 'loading';
        state.form.processState = 'loading';
        return axios.get(proxify(sourceUrl));
      })
      .then((response) => {
        const { channel, items } = parse(response.data);
        const feedId = uniqueId();
        const newFeed = { ...channel, feedId };
        const newPosts = addId(items, feedId);
        state.urls.push(sourceUrl);
        state.feeds.push(newFeed);
        state.posts.push(...newPosts.reverse());
        state.form.processState = 'filling';
        state.form.feedback = 'success';
        updateFeed(sourceUrl, feedId);
      })
      .catch((err) => {
        state.form.valid = false;
        if (axios.isAxiosError(err)) {
          state.form.feedback = 'axiosError';
        } else if (err.parseError) {
          state.form.feedback = 'parseError';
        } else {
          state.form.feedback = err.type;
        }
        state.form.processState = 'error';
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      state.posts = state.posts.map((post) => {
        if (post.postId === postId) {
          return { ...post, viewed: true };
        }
        return post;
      });
      state.previewPost = state.posts.find((post) => post.postId === postId);
    }
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources,
  })
    .then(() => app(i18nextInstance));
};
