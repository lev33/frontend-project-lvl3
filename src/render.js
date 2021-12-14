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




export default (elements) => (path, value, prevValue) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(elements, value);
        break;
  
      case 'form.processError':
 //       handleProcessError();
        break;
  
      case 'form.valid':
        elements.btnAdd.disabled = !value;
        break;
  
      case 'form.errors':
 //       renderErrors(elements, value, prevValue);
        break;
  
      default:
        break;
    }
  };