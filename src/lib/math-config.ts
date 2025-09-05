import 'katex/dist/katex.min.css'

export const mathConfig = {
  inlineMath: [['$', '$']],
  displayMath: [['$$', '$$']],
  throwOnError: false,
  errorColor: '#cc0000',
  strict: false,
  trust: false,
  macros: {
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\C": "\\mathbb{C}",
  }
}
