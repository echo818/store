Component({
  options: {
    multipleSlots: true
  },

  data: {
    moreStyle: 'transform: translate3d(160rpx, 0, 0)',
    cellStyle: 'transform: translate3d(0px, 0, 0)'
  },

  methods: {
    startEvt(e) {
      this.setData({
        startX: e.touches[0].clientX
      })
    },
    moveEvt(e) {
      if (this.data.distX <= 0) {
        this.setData({
          distX: this.data.startX - e.touches[0].clientX,
          cellStyle: `transform: translate3d(0rpx, 0, 0)`,
          moreStyle: `transform 0.2s; transform: translate3d(160rpx, 0, 0)`
        })
      } else {
        let moveX = 160 - this.data.distX
        moveX = moveX < 0 ? 0 : moveX
        this.setData({
          distX: this.data.startX - e.touches[0].clientX,
          cellStyle: `transform: translate3d(-${this.data.distX}rpx, 0, 0)`,
          moreStyle: `transform 0.2s; transform: translate3d(${moveX}rpx, 0, 0)`
        })
      }
    },
    endEvt(e) {
      if (this.data.distX > 48) {
        this.setData({
          cellStyle: `transform: translate3d(-160rpx, 0, 0)`,
          moreStyle: `transform 0.2s; transform: translate3d(0rpx, 0, 0)`,
          startX: 0,
          distX: 160
        })
      } else {
        this.setOffset()
      }
    },
    hideEvt(e) {
      if (this.data.distX !== 0) {
        this.setOffset()
      }
    },
    setOffset() {
      this.setData({
        cellStyle: `transform: translate3d(0rpx, 0, 0)`,
        moreStyle: `transform 0.2s; transform: translate3d(160rpx, 0, 0)`,
        startX: 0,
        distX: 0
      })
    }
  }
})
