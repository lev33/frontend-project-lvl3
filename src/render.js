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

export default (elements, i18nextInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.feedback':
      handleFeedback(elements, value, i18nextInstance);
      break;

    case 'form.valid':
      handleFormState(elements, value);
      break;

    case 'form.errors':
      //       renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};
