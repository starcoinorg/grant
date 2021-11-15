import {
  ElConfigProvider,
  ElContainer,
  ElHeader,
  ElFooter,
  ElMain,
  ElAffix,
  ElButton,
  ElScrollbar,
  ElDatePicker,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElInput,
  ElDivider,
  ElTooltip
} from 'element-plus'

export default (app) => {
  app.use(ElConfigProvider)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElFooter)
  app.use(ElMain)
  app.use(ElAffix)
  app.use(ElButton)
  app.use(ElScrollbar)
  app.use(ElDatePicker)
  app.use(ElDropdown)
  app.use(ElDropdownMenu)
  app.use(ElDropdownItem)
  app.use(ElMessageBox)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElDivider)
  app.use(ElTooltip)
}
