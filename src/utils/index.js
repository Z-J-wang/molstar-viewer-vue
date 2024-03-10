const fetchText = async (url) => {
  const response = await fetch(url)
  return response.text()
}

export { fetchText }
