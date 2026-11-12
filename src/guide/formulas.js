renderMathInElement(document.querySelector('#guide'), {
  delimiters: [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ],
  throwOnError: false,
  trust: false
});
