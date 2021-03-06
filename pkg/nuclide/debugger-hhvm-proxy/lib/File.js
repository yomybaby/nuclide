'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 * A file in the file cache.
 */
class File {
  _path: string;
  _source: ?string;

  constructor(path: string) {
    this._path = path;
    this._source = null;
  }

  async getSource(): Promise<string> {
    let source = this._source;
    if (source === null) {
      source = (await require('../../commons').readFile(this._path, 'utf8')).toString();
      this._source = source;
    }
    return source;
  }
}


module.exports = File;
