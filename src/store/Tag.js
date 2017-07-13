import {extendObservable} from 'mobx'

export default class Tag {

  constructor() {
    extendObservable(this, {
      label: null,
      name: '',
    })
  }

  fromJSON(json) {
    this.label = json.label
    this.name = json.name
  }
}
