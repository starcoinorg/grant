import request from '@/utils/request'
import I18n from '@/i18n'

export function getTime() {
  return request({
    url: '/time',
    showSuccess: false,
    showError: false
  })
}

export function getToken(sign_msg) {
  return request({
    url: '/user/v1/token',
    method: 'POST',
    showSuccess: false,
    showError: false,
    data: { sign_msg }
  })
}

export function refreshToken() {
  return request({
    url: '/user/v1/token',
    method: 'PUT',
    showError: false
  })
}

export function getDicts() {
  return request({
    url: '/home/v1/dict',
    showError: false,
    loading: false
  })
}

export function setGrant(title, amount, desc, detail_link, contact, end_ts, recipients) {
  return request({
    url: '/user/v1/grants',
    method: 'POST',
    successMessage: I18n.global.tm('create.message.success'),
    data: { title, amount, desc, detail_link, contact, end_ts, recipients }
  })
}

export function vote(sign_msg) {
  return request({
    url: '/user/v1/grants_vote',
    method: 'POST',
    successMessage: I18n.global.tm('vote.message.success'),
    data: { sign_msg }
  })
}

export function getGrants(page_size, page_number, lable) {
  return request({
    url: '/home/v1/grants_list',
    showError: false,
    params: { page_size, page_number, lable }
  })
}

export function getGrantById(gid) {
  return request({
    url: '/home/v1/grants',
    params: { gid }
  })
}

export function getConfig() {
  return request({
    url: '/home/v1/pub_config',
    showError: false,
    loading: false
  })
}
