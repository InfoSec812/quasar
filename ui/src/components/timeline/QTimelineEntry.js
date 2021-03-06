import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import slot, { uniqueSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTimelineEntry',

  inject: {
    __timeline: {
      default () {
        console.error('QTimelineEntry needs to be child of QTimeline')
      }
    }
  },

  props: {
    heading: Boolean,
    tag: {
      type: String,
      default: 'h3'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right'].includes(v)
    },

    icon: String,
    avatar: String,

    color: String,

    title: String,
    subtitle: String,
    body: String
  },

  computed: {
    colorClass () {
      return `text-${this.color || this.__timeline.color}`
    },

    classes () {
      return `q-timeline__entry--${this.side}` +
        (this.icon !== void 0 || this.avatar !== void 0 ? ' q-timeline__entry--icon' : '')
    },

    reverse () {
      return this.__timeline.layout === 'comfortable' && this.__timeline.side === 'left'
    }
  },

  render (h) {
    const def = uniqueSlot(this, 'default', [])

    if (this.body !== void 0) {
      def.unshift(this.body)
    }

    if (this.heading === true) {
      const content = [
        h('div'),
        h('div'),
        h(
          this.tag,
          { staticClass: 'q-timeline__heading-title' },
          def
        )
      ]

      return h('div', {
        staticClass: 'q-timeline__heading',
        on: this.$listeners
      }, this.reverse === true ? content.reverse() : content)
    }

    let dot

    if (this.icon !== void 0) {
      dot = [
        h(QIcon, {
          staticClass: 'row items-center justify-center',
          props: { name: this.icon }
        })
      ]
    }
    else if (this.avatar !== void 0) {
      dot = [
        h('img', {
          staticClass: 'q-timeline__dot-img',
          domProps: { src: this.avatar }
        })
      ]
    }

    const content = [
      h('div', { staticClass: 'q-timeline__subtitle' }, [
        h('span', slot(this, 'subtitle', [ this.subtitle ]))
      ]),

      h('div', {
        staticClass: 'q-timeline__dot',
        class: this.colorClass
      }, dot),

      h('div', { staticClass: 'q-timeline__content' }, [
        h('h6', { staticClass: 'q-timeline__title' }, slot(this, 'title', [ this.title ]))
      ].concat(def))
    ]

    return h('li', {
      staticClass: 'q-timeline__entry',
      class: this.classes,
      on: this.$listeners
    }, this.reverse === true ? content.reverse() : content)
  }
})
