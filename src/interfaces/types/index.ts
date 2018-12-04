export interface BaseInterface {
  create: boolean,
  extension: string,
  template?: string,
  suffix?: string,
  type?: string
}

export interface ComponentInterface extends BaseInterface {
}

export interface CSSInterface extends BaseInterface {
}

export interface IndexInterface extends BaseInterface {
}
