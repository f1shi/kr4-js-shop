const orderForm = document.querySelector('#order-form-page');

if (orderForm) {
  const nameInput = orderForm.querySelector('#page-name');
  const emailInput = orderForm.querySelector('#page-email');
  const phoneInput = orderForm.querySelector('#page-phone');
  const topicSelect = orderForm.querySelector('#page-topic');
  const agreementCheckbox = orderForm.querySelector('#page-agreement');

  const nameError = orderForm.querySelector('#page-name-error');
  const emailError = orderForm.querySelector('#page-email-error');
  const phoneError = orderForm.querySelector('#page-phone-error');
  const topicError = orderForm.querySelector('#page-topic-error');
  const agreementError = orderForm.querySelector('#page-agreement-error');

  const formMessage = orderForm.querySelector('.form-message');
  const commentInput = orderForm.querySelector('#page-comment');
  const submitButton = orderForm.querySelector('button[type="submit"]');

  function fillOrderFromCart() {
    const cartProducts = getCartProducts();

    if (cartProducts.length === 0 || !commentInput) {
      return;
    }

    const lines = cartProducts.map((cartProduct) => {
      return `${cartProduct.product.title} × ${cartProduct.quantity}`;
    });

    topicSelect.value = 'product';
    commentInput.value = `Товары из корзины:\n${lines.join('\n')}`;
  }

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateName() {
    const value = nameInput.value.trim();

    if (value.length < 2) {
      showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
      return false;
    }

    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const phonePattern = /^[0-9+\-()\s]+$/;

    if (value.length < 6 || !phonePattern.test(value)) {
      showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
      return false;
    }

    clearError(phoneInput, phoneError);
    return true;
  }

  function validateTopic() {
    if (topicSelect.value === '') {
      showError(topicSelect, topicError, 'Выберите тему заявки.');
      return false;
    }

    clearError(topicSelect, topicError);
    return true;
  }

  function validateAgreement() {
    if (!agreementCheckbox.checked) {
      showError(agreementCheckbox, agreementError, 'Необходимо согласие на обработку данных.');
      return false;
    }

    clearError(agreementCheckbox, agreementError);
    return true;
  }

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isTopicValid = validateTopic();
    const isAgreementValid = validateAgreement();

    const isFormValid =
      isNameValid && isEmailValid && isPhoneValid && isTopicValid && isAgreementValid;

    if (!isFormValid) {
      formMessage.textContent = 'Проверьте поля формы.';
      return;
    }

    const requestData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      topic: topicSelect.value,
      comment: commentInput ? commentInput.value.trim() : '',
      cart: getCartProducts().map((cartProduct) => ({
        id: cartProduct.product.id,
        quantity: cartProduct.quantity
      }))
    };

    console.table(requestData);

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    formMessage.textContent = 'Отправляем заявку...';

    setTimeout(() => {
      formMessage.textContent = `Спасибо, ${requestData.name}! Заявка отправлена, менеджер свяжется с вами.`;
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить заявку';
      orderForm.reset();
      clearCart();
    }, 800);
  });

  fillOrderFromCart();

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  topicSelect.addEventListener('change', validateTopic);
  agreementCheckbox.addEventListener('change', validateAgreement);
}
