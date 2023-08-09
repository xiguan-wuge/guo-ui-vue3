import { ref } from "vue";
import {ConfigProvider} from '..'
import {Icon} from '../../../icon'
import {later, mount} from '../../../test'
import Popup from '../../popup'
import { describe, test, expect } from "@jest/globals";

describe('test config-provider', () => {
  test('should render tag prop correctly', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        tag: 'section'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should change icon class-prefix when using icon-prefix prop', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider iconPrefix="foo">
            <Icon name="success"></Icon>
          </ConfigProvider>
        )
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should change global z-index when using z-index prop',  async () => {
    const show = ref(true)
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider zIndex={0}>
            <Popup v-model:show={show.value}></Popup>
          </ConfigProvider>
        )
      }
    })
    await later() // ?
    expect(wrapper.find('g-popup').style.zIndex).toEqual('1')
  })

  test('should apply theme-vars-light in light mode', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            themeVars={{rateIconFullColor: 'red'}}
            themeVarsDark={{rateIconFullColor: 'green'}}
            themeVarsLight={{rateIconFullColor: 'blue'}}
          ></ConfigProvider>
        )
      }
    })
    expect(wrapper.element.getAttribute('style')).toEqual(
      '--g-rate-icon-full-color: blue'
    )
  })

  test('should apply theme-vars-dark in dark mode', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            theme="dark"
            themeVars={{rateIconFullColor: 'red'}}
            themeVarsDark={{rateIconFullColor: 'green'}}
            themeVarsLight={{rateIconFullColor: 'blue'}}
          ></ConfigProvider>
        )
      }
    })
    expect(wrapper.element.getAttribute('style')).toEqual(
      'g-rate-icon-full-color: green'
    )
  })
})
