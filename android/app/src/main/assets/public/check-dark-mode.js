// Debug script to check dark mode
console.log('=== Dark Mode Debug ===');
console.log('HTML classList:', document.documentElement.classList.toString());
console.log('Has dark class:', document.documentElement.classList.contains('dark'));
console.log('Theme in localStorage:', localStorage.getItem('theme'));

// Force reapply dark theme
if (!document.documentElement.classList.contains('dark')) {
  console.log('⚠️ Dark class missing, adding it...');
  document.documentElement.classList.add('dark');
  console.log('✅ Dark class added');
}

// Check admonitions
setTimeout(() => {
  const admonitions = document.querySelectorAll('.admonition');
  console.log('Found admonitions:', admonitions.length);
  admonitions.forEach((el, i) => {
    const styles = window.getComputedStyle(el);
    console.log(`Admonition ${i}:`, {
      className: el.className,
      backgroundColor: styles.backgroundColor,
      borderColor: styles.borderLeftColor
    });
  });
}, 1000);
