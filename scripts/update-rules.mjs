import request from "request";
import { Transform } from "node:stream";
import { stringify } from "JSONStream";
import { createWriteStream } from "node:fs";

/** Download URL */
const srcUrl = "https://publicsuffix.org/list/effective_tld_names.dat";
/** Destination file */
const dest = new URL("../data/rules.json", import.meta.url);

/**
 * Parse lint (trim and ignore empty lines and comments)
 * @param {string} line
 */
const parseLine = (line) => {
  const trimmed = line.trim();

  // Ignore empty lines and comments.
  if (!trimmed || (trimmed.charAt(0) === "/" && trimmed.charAt(1) === "/")) {
    return;
  }

  // Only read up to first whitespace char.
  const rule = trimmed.split(" ")[0];
  return rule;
};

const parse = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    if (this._last === undefined) {
      this._last = "";
    }

    this._last += `${chunk}`;
    const list = this._last.split(/\n/);
    this._last = list.pop();

    for (let i = 0; i < list.length; i++) {
      const parsed = parseLine(list[i]);
      if (parsed) {
        this.push(parsed);
      }
    }

    cb();
  },
  flush(cb) {
    if (this._last) {
      this.push(this._last);
    }
    cb();
  },
});

request(srcUrl)
  .pipe(parse)
  .pipe(stringify("[\n", ",\n", "\n]"))
  .pipe(createWriteStream(dest));
