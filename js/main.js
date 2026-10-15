/* =========================================================
   МОДАЛЬНОЕ ОКНО + ОБРАБОТКА ФОРМЫ В МОДАЛКЕ (index, catalog, product)
   ========================================================= */

function setFieldError(element, isInvalid) {
  const errorElement = document.getElementById(`${element.id}-error`);

  if (isInvalid) {
    element.setAttribute('aria-invalid', 'true');
  } else {
    element.removeAttribute('aria-invalid');
  }

  if (errorElement) {
    errorElement.hidden = !isInvalid;
  }
}

const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

if (orderDialog && orderButtons.length > 0) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || '';
      if (selectedProductInput) selectedProductInput.value = productName;
      orderDialog.showModal();
    });
  });
}

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        setFieldError(element, false);
      }
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          setFieldError(element, true);
        }
      });
      orderForm.reportValidity();
      return;
    }

    if (successMessage) successMessage.hidden = false;
    orderForm.reset();
    if (orderDialog) orderDialog.close();
  });
}

/* =========================================================
   ФОРМА НА СТРАНИЦЕ order.html
   ========================================================= */

const pageOrderForm = document.getElementById('order-form-page');
const pageSuccessMessage = document.getElementById('success-message-page');

if (pageOrderForm) {
  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(pageOrderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        setFieldError(element, false);
      }
    });

    if (!pageOrderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          setFieldError(element, true);
        }
      });
      pageOrderForm.reportValidity();
      return;
    }

    if (pageSuccessMessage) pageSuccessMessage.hidden = false;
    pageOrderForm.reset();
  });
}

/* =========================================================
   ФОРМА ОБРАТНОЙ СВЯЗИ НА contacts.html
   ========================================================= */

const feedbackForm = document.getElementById('feedback-form');
const feedbackSuccess = document.getElementById('success-message-contacts');

if (feedbackForm) {
  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(feedbackForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        setFieldError(element, false);
      }
    });

    if (!feedbackForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          setFieldError(element, true);
        }
      });
      feedbackForm.reportValidity();
      return;
    }

    if (feedbackSuccess) feedbackSuccess.hidden = false;
    feedbackForm.reset();
  });
}
const siteNav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.site-nav__toggle');

if (siteNav && navToggle) {
  siteNav.classList.add('site-nav--collapsible');
  navToggle.hidden = false;

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('site-nav--open', !isOpen);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('site-nav--open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('site-nav--open');
      navToggle.focus();
    }
  });
}
