export type Mod = string | {[key: string]: any} // 联合类型，key是固定还是占位？
export type Mods = Mod | Mod[] // 同样是联合类型


// 生成bem命名样式
function genBem(name: string, mods?: Mods): string {
  // 没有下级名，return
  if(!mods){
    return ''
  }

  // 字符串情况，直接使用--拼接
  if(typeof mods == 'string') {
    return ` ${name}--${mods}`
  }

  // 数组，递归， 生成字符串
  if(Array.isArray(mods)) {
    return (mods as Mod[]).reduce<string>(
      (ret, item) => ret + genBem(name, item),
      ''
    )
  }

  // 对象
  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name, key): ''),
    ''
  )
}
export function createBEM(name:string) {
  return (el?:Mods, mods?:Mods):Mods => {
    console.log('el', el);
    
    if(el && typeof el !== 'string') {
      mods = el
      el = ''
    }

    el = el ? `${name}__${el}` : name
    console.log('el2', el);
    
    return `${el}${genBem(el, mods)}`
   }
}

export function createNamespace(name:string) {
  const prefixedName = `g-${name}`
  return [
    prefixedName,
    createBEM(prefixedName)
  ] as const
}