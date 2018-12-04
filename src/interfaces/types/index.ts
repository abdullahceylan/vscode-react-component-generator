export interface BaseInterface {
  create: boolean,
  extension: string,
  template?: string
}

export interface ComponentInterface extends BaseInterface {
}

export interface CSSInterface extends BaseInterface {
  suffix?: string,
  type?: string
}

export interface IndexInterface extends BaseInterface {
}
