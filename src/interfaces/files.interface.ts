import {
    IndexInterface,
    CSSInterface,
    ComponentInterface,
 } from './types';
 
export default interface FileInterface {
    component: ComponentInterface,
    style: CSSInterface,
    index: IndexInterface,
}