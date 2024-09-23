<template>
  <adv-layout-page>
    <adv-layout-page-item>
      <adv-button text style="font-size: 28px" tip="编辑" icon="Edit" />
      <adv-button text tip="删除" icon="Delete" />
      <adv-button link tip="primary" icon="Search" />
      <adv-button text tip="primary" icon="Search" />
      <adv-button text type="primary" tip="primary" icon="Edit" />
      <adv-button text type="success" tip="success" icon="Check" />
      <adv-button text type="info" tip="info" icon="Message" />
      <adv-button text type="warning" tip="warning" icon="Star" />
      <adv-button
        text
        type="danger"
        tip="danger"
        icon="Delete"
        :tipProps="{
          effect: 'light',
          placement: 'bottom'
        }"
      />
    </adv-layout-page-item>
  </adv-layout-page>
</template>
