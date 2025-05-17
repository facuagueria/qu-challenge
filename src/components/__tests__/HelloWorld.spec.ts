import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import JokesList from '../JokesList.vue'

describe('helloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(JokesList, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
