/**
 * Модальне вікно авторизації для вебзастосунку «MandryStay»
 * Лабораторна робота №4 — Завдання №10 (Андронов Д. Ю., ІС-43)
 */

'use strict';

// Навчальні демонстраційні дані для перевірки авторизації (без реальних секретів)
const DEMO_AUTH_ACCOUNT = Object.freeze({
  identifier: 'demo@mandrystay.ua',
  password: 'mandry2026'
});

function validateAuthForm(fields = {}) {
  const errors = {};
  const normalizedIdentifier = String(fields.identifier ?? '').trim();
  const password = String(fields.password ?? '');

  if (normalizedIdentifier === '') {
    errors.identifier = 'Введіть email або логін.';
  } else if (normalizedIdentifier.includes('@')) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(normalizedIdentifier)) {
      errors.identifier = 'Некоректний формат email (приклад: name@mandrystay.ua).';
    }
  } else if (/\s/.test(normalizedIdentifier)) {
    errors.identifier = 'Логін не повинен містити пробілів.';
  } else if (normalizedIdentifier.length < 3) {
    errors.identifier = 'Логін має містити щонайменше 3 символи.';
  }

  if (password.trim() === '') {
    errors.password = 'Введіть пароль.';
  } else if (password.length < 6) {
    errors.password = 'Пароль має містити щонайменше 6 символів.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalizedIdentifier
  };
}

function initAuthModal() {
  if (typeof document === 'undefined') {
    return;
  }

  const openBtn = document.getElementById('open-auth-modal-btn');
  const overlay = document.getElementById('auth-modal-overlay');
  const closeBtn = document.getElementById('auth-modal-close');
  const form = document.getElementById('auth-modal-form');
  const identifierInput = document.getElementById('auth-identifier');
  const passwordInput = document.getElementById('auth-password');
  const identifierError = document.getElementById('auth-err-identifier');
  const passwordError = document.getElementById('auth-err-password');
  const statusBanner = document.getElementById('auth-modal-status');
  const togglePassBtn = document.getElementById('auth-toggle-password');
  const fillDemoBtn = document.getElementById('auth-fill-demo-btn');

  if (!openBtn || !overlay || !form) {
    return;
  }

  const clearErrors = () => {
    [identifierInput, passwordInput].forEach((input) => {
      if (input) input.classList.remove('is-invalid', 'is-valid');
    });
    if (identifierError) identifierError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    if (statusBanner) {
      statusBanner.className = 'auth-modal-status';
      statusBanner.textContent = '';
    }
  };

  const openModal = () => {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (identifierInput) {
      identifierInput.focus();
    }
  };

  const closeModal = () => {
    overlay.hidden = true;
    document.body.style.overflow = '';
    openBtn.focus();
  };

  openBtn.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) {
      closeModal();
    }
  });

  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassBtn.textContent = isHidden ? 'Сховати' : 'Показати';
    });
  }

  if (fillDemoBtn && identifierInput && passwordInput) {
    fillDemoBtn.addEventListener('click', () => {
      clearErrors();
      identifierInput.value = DEMO_AUTH_ACCOUNT.identifier;
      passwordInput.value = DEMO_AUTH_ACCOUNT.password;
      identifierInput.focus();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const identifier = identifierInput ? identifierInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    const result = validateAuthForm({ identifier, password });

    if (result.errors.identifier) {
      if (identifierInput) identifierInput.classList.add('is-invalid');
      if (identifierError) identifierError.textContent = result.errors.identifier;
    } else if (identifierInput) {
      identifierInput.classList.add('is-valid');
    }

    if (result.errors.password) {
      if (passwordInput) passwordInput.classList.add('is-invalid');
      if (passwordError) passwordError.textContent = result.errors.password;
    } else if (passwordInput) {
      passwordInput.classList.add('is-valid');
    }

    if (!result.isValid) {
      if (statusBanner) {
        statusBanner.className = 'auth-modal-status is-visible is-error';
        statusBanner.textContent = 'Перевірте коректність введених даних авторизації.';
      }
      console.log('MandryStay Auth — помилка валідації:', result.errors);
      return;
    }

    if (statusBanner) {
      statusBanner.className = 'auth-modal-status is-visible is-success';
      statusBanner.textContent = `Вітаємо, ${result.normalizedIdentifier}! Авторизацію в MandryStay успішно виконано.`;
    }
    openBtn.textContent = `Гість: ${result.normalizedIdentifier}`;
    openBtn.classList.add('is-authenticated');
    console.log(`MandryStay Auth — успішний вхід користувача: ${result.normalizedIdentifier}`);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initAuthModal);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEMO_AUTH_ACCOUNT,
    validateAuthForm,
    initAuthModal
  };
}
