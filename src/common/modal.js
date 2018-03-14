const modal = weex.requireModule('modal')

function toast(msg) {
  modal.toast({
    message: `${msg}`,
    duration: 2.0
  });
}

export default {
  toast
}