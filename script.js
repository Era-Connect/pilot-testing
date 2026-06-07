// ── Progress bar
const allFields = document.querySelectorAll('input:not([type=checkbox]):not([type=radio]), select, textarea');
const progressFill = document.getElementById('progressFill');
const required = ['full_name','phone','gender','state','lga','category','biz_size','experience'];

function updateProgress() {
  let filled = 0;
  required.forEach(name => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el && el.value.trim()) filled++;
  });
  progressFill.style.width = Math.round((filled / required.length) * 100) + '%';
}

allFields.forEach(f => f.addEventListener('input', updateProgress));
document.querySelectorAll('input[type=radio], input[type=checkbox]').forEach(f => f.addEventListener('change', updateProgress));

// ── Form submission (Iframe Method)
document.getElementById('pilotForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSdsWwWPZgOB9lOr0jAo74_58nFpyL66B903M5IrndnWuVPw_ltdkeDqUd5fOZSbGL/exec";
  let valid = true;

  // Clear previous errors
  document.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
  document.getElementById('consentError').style.display = 'none';

  // Validate required fields
  const checks = [
    { id: 'f-fname',    name: 'full_name' },
    { id: 'f-phone',    name: 'phone' },
    { id: 'f-state',    name: 'state' },
    { id: 'f-category', name: 'category' },
  ];

  checks.forEach(({ id, name }) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (!el || !el.value.trim()) {
      document.getElementById(id)?.classList.add('has-error');
      valid = false;
    }
  });

  if (!document.getElementById('consentCheck').checked) {
    document.getElementById('consentError').style.display = 'block';
    valid = false;
  }

  if (!valid) {
    document.querySelector('.field.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Submission process
  btn.textContent = 'Processing...';
  btn.disabled = true;

  // Create hidden iframe to bypass CORS
  const iframe = document.createElement('iframe');
  iframe.name = "hidden_iframe";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  form.target = "hidden_iframe";
  form.action = WEB_APP_URL;
  form.method = "POST";
  form.submit();

  // Trigger success UI after a short delay
  setTimeout(() => {
    const ref = 'ERA-F-' + String(Math.floor(Math.random() * 9000) + 1000);
    document.getElementById('refCode').textContent = 'Your Ref: ' + ref;
    document.getElementById('pilotForm').style.display = 'none';
    const success = document.getElementById('successScreen');
    success.style.display = 'block';
    progressFill.style.width = '100%';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1000);
});