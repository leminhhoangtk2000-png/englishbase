declare module 'remark-admonitions' {
  import { Plugin } from 'unified'
  
  interface AdmonitionOptions {
    tag?: string
    icons?: 'emoji' | 'svg' | 'none'
    infima?: boolean
    customTypes?: {
      [key: string]: {
        keyword: string
        emoji?: string
        svg?: string
      }
    }
  }
  
  const remarkAdmonitions: Plugin<[AdmonitionOptions?]>
  export default remarkAdmonitions
}
