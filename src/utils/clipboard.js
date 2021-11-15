import { ElMessage } from 'element-plus'
import I18n from '@/i18n'
import Clipboard from 'clipboard'

function clipboardResult(flag, callback) {
  if (callback) {
    callback(flag)
  }
  const message = flag ? I18n.global.tm('common.copysuccess') : I18n.global.tm('common.copyerror')
  ElMessage.success(message)
}

export default function handleClipboard(text, event, callback) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardResult(true, callback)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardResult(false, callback)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
