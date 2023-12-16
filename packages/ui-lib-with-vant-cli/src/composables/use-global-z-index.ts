
// Popup 组件的 zIndex 

let globalZIndex = 2000

// 当被读取时，全局zIndex将会自增
export const useGlobalZIndex = () => ++globalZIndex

// 重置zIndex
export const setGlobalZIndex = (val: number) => {
  globalZIndex = val
}
