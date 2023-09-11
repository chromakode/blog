function sizePage() {
  // Avoid changing hero height on scroll when browser chrome resizes
  if (window.scrollY > 0) {
    return
  }

  // Use min height of viewport (excluding address bar, unlike vh which includes
  // it) -- someday maybe svh will be usable here.
  // https://stackoverflow.com/a/69367449
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function handleScroll() {
  document.body.classList.toggle('scrolled', window.scrollY > 50)
}

sizePage()
handleScroll()
window.addEventListener('resize', sizePage)
window.addEventListener('scroll', handleScroll)
