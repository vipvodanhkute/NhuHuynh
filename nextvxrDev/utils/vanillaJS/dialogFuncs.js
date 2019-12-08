
export const hideBodyScroll = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  document.getElementsByTagName('body')[0].style.position = 'fixed'
  document.getElementsByTagName('body')[0].style.height = '100%'
}

export const showBodyScroll = () => {
  setTimeout(() => {
    document.getElementsByTagName('body')[0].style.overflow = ''
    document.getElementsByTagName('body')[0].style.position = ''
    document.getElementsByTagName('body')[0].style.height = ''
  }, 0)
}
