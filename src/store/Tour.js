import { extendObservable } from "mobx";

export default class Tour {
  constructor() {
    extendObservable(this, {
      id: null,
      name: "",
      intro: "",
      images: [],
      price: 0,
      vendor: "",
      currency: "EUR"
    });
  }

  getMediumImage = () => {
    if (this.images.length) {
      if (this.images[0].sizes.medium) return this.images[0].sizes.medium.url;
      if (this.images[0].sizes.thumbnail)
        return this.images[0].sizes.thumbnail.url;
    }
    return "/placeholder.jpg";
  };

  getOriginalImage = () => {
    if (this.images.length) {
      if (this.images[0].sizes.original)
        return this.images[0].sizes.original.url;
      if (this.images[0].sizes.medium) return this.images[0].sizes.medium.url;
    }
    return "/placeholder.jpg";
  };

  fromJSON(json) {
    this.id = json.id;
    this.name = json.name;
    this.intro = json.intro;
    this.images = json.images;
    this.vendor = json.vendor;

    if (json.converted_price) {
      this.price = json.converted_price.amount;
      this.currency = json.converted_price.currency;
    } else if (json.price) {
      this.price = json.price.amount;
      this.currency = json.price.currency;
    }
  }
}
