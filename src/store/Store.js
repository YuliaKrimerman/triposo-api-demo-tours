import { extendObservable, action, computed } from "mobx";
import { apiRequest } from "../utils";

import Location from "./Location";
import Poi from "./Poi";
import Tag from "./Tag";
import Tour from "./Tour";

export default class TourStore {
  constructor() {
    extendObservable(this, {
      location: new Location(),
      poi: new Poi(),
      hasMore: false,
      tagOptions: [],
      selectedTag: "all",
      tag: new Tag(),
      tours: [],
      page: 1,
      totalPages: 1,
      toursLoading: false,
      isValid: computed(() => {
        return this.location.id !== null;
      })
    });
  }

  reset() {
    this.location.reset();
    this.tours.clear();
    this.page = 1;
  }

  fetchTourTagsForLocation(locationId) {
    this.tagOptions.clear();
    this.tagOptions.push({
      label: "all",
      name: "All"
    });

    return apiRequest(
      `tag.json?location_id=${locationId}&tour_count=>=5&type=!tour_itinerary&order_by=-tour_count&fields=tour_count,name,label`
    ).then(
      action(json => {
        json.results.forEach(o => this.tagOptions.push(o));
      })
    );
  }

  nextPage() {
    this.page = this.page + 1;
  }

  prevPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
    }
  }

  fetchTours(locationId, tagLabel, poiId) {
    console.log("Fetching tours", locationId, tagLabel, poiId);
    let promises = [];
    if (!this.location.id)
      promises.push(
        this.fetchLocation(locationId).then(loc => (this.location = loc))
      );
    if (tagLabel !== "all") {
      if (!this.tag.label)
        promises.push(this.fetchTag(tagLabel).then(tag => (this.tag = tag)));
    }
    if (poiId !== "all") {
      if (!this.poi.id)
        promises.push(this.fetchPoi(poiId).then(poi => (this.poi = poi)));
    }

    this.tours.clear();
    this.toursLoading = true;

    const limit = 12;
    const offset = (this.page - 1) * limit;

    let tagLabelQuery = "";
    if (tagLabel !== "all") {
      tagLabelQuery = `&tag_labels=${tagLabel}`;
    }

    let poiQuery = "";
    if (poiId !== "all") {
      poiQuery = `&poi_id=${poiId}`;
    }

    promises.push(
      apiRequest(
        `tour.json?location_ids=${locationId}&order_by=-score&offset=${offset}&count=${limit}&annotate=converted_price:eur&order_by=converted_price&fields=id,name,images,price,vendor${tagLabelQuery}${poiQuery}`
      ).then(
        action(json => {
          this.hasMore = json.more;
          this.totalPages = Math.ceil(json.estimated_total / limit);
          json.results.forEach(o => {
            let t = new Tour();
            t.fromJSON(o);
            this.tours.push(t);
          });
          this.toursLoading = false;
          return Promise.resolve(this.tours);
        })
      )
    );
    return Promise.all(promises);
  }

  fetchLocation(id) {
    return apiRequest(`location.json?id=${id}`).then(
      action(json => {
        if (json.results.length) {
          let loc = new Location();
          loc.fromJSON(json.results[0]);
          return Promise.resolve(loc);
        }
        return Promise.reject(`location with id: ${id} not found`);
      })
    );
  }

  fetchPoi(id, fields = null) {
    let extra = "";
    if (fields) {
      extra = `&fields=${fields}`;
    }

    return apiRequest(`poi.json?id=${id}${extra}`).then(
      action(json => {
        if (json.results.length) {
          let poi = new Poi();
          poi.fromJSON(json.results[0]);
          return Promise.resolve(poi);
        }
        return Promise.reject(`poi with id: ${id} not found`);
      })
    );
  }

  fetchTag(label) {
    return apiRequest(`tag.json?label=${label}`).then(
      action(json => {
        if (json.results.length) {
          let tag = new Tag();
          tag.fromJSON(json.results[0]);
          return Promise.resolve(tag);
        }
        return Promise.reject(`tag with label: ${label} not found`);
      })
    );
  }
}
