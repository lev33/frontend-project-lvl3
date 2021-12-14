import onChange from 'on-change';
import render from './render.js';

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
          valid: true,
          processState: 'filling',
          processError: null,
          errors: {},
          fields: {
            url: '',
          },
          feedback: null,
        },
      }, render(elements));

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.form);
        const sourceUrl = formData.get('url');

    });   
};