(() => {
  const form = document.getElementById('login-form');
  const userIdInput = document.getElementById('userId');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('error-msg');

  function setError(text) {
    errorMsg.textContent = text;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setError('');

    const userId = userIdInput.value.trim();
    const password = passwordInput.value;

    if (!/^\d+$/.test(userId)) {
      setError('User ID must contain only numbers.');
      userIdInput.focus();
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      setError('Password must contain characters.');
      passwordInput.focus();
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      window.location.href = data.redirect || '/dashboard';
    } catch (error) {
      setError('Unable to login. Please try again.');
    }
  });
})();
