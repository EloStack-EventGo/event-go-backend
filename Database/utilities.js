export class Flag {
  constructor(value = false) {
    this.value = value;
  }
  set_false() {
    this.value = false;
  }
  set_true() {
    this.value = true;
  }
  check() {
    return this.value;
  }
}

export class UserSession {
  constructor(session = null) {
    if (session == null) {
      this.session = session;
    } else {
      this.session = {};
    }
  }

  data() {
    return this.session;
  }
}

export class JsonFieldExtractor {
  constructor() {
    this.fields = null;
  }

  FieldsToExtract(fields) {
    this.fields = fields;
  }

  Extract() {}
}
