import {mount} from '@vue/test-utils'
import {Button} from '..'
import {describe, expect, test} from '@jest/globals';


describe('test button', () => {
  test('should emit click event', () => {
    const wrapper = mount(Button)
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  test('should not emit click event when disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  test('should not emit click event when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })
    wrapper.trigger('click')
    expect(wrapper.emitted('clicck')).toBeFalsy()
  })

  test('should hide border when color is gradient', () => {
    const wrapper = mount(Button, {
      props: {
        color: 'linear-gradient(#000, #fff)'
      }
    })
    expect(wrapper.style.border).toEqual('0px')
  })

  test('should change icon class prefix when using icon-prefix prop', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'success',
        iconPrefix: 'my-icon'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should render loading slot corretly',() => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }, 
      slots: {
        loading: () => 'Custom Loading'
      }
    })
    // 设置快照，第一次test 产生快照；后面再次test,将新生成的快照和之前的对比，若发生变化，则测试不通过
    expect(wrapper.html()).toMatchSnapshot()
    // 行内Snapshot和普通Snapshot的区别
    // toMatchInlineSnapshot() 行内Snapshot把生成的快照放到了测试用例里边，作为第二个参数的形式传入。
    // toMatchSnapshot() 普通Snapshot会把生成的快照放到单独的文件里。
  })

  test('should render loading of a specific size when using loading size prop', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        loadingSize: '10px'
      }
    })
    const loading = wrapper.find('.g-loading__spinner')
    expect(loading.style.width).toEqual('10px')
    expect(loading.style.height).toEqual('10px')
  })

  test('should render icon in the right side when setting icon-position to right', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'plus',
        iconPostion: 'right'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should render icon slot correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: () => 'Text',
        icon: () => 'Custom Icon'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})