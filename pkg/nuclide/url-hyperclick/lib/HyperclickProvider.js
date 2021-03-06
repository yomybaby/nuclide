'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {HyperclickSuggestion} from '../../hyperclick-interfaces';

import {Range} from 'atom';

// This regex could be improved -- right now it just matches everything starting with http:// or
// https:// and consuming characters as long as they are not whitespace or a closing ), ], or },
// while ignoring trailing periods.
// This is so that links in parentheses etc. are still matched properly. We could improve this so
// that it matches only legal URI characters, but this should be fine.
const URL_REGEX = /\b(https?:\/\/[^\s)}\]]*[^.\s)}\]])/;

export class HyperclickProvider {
  priority: number;
  providerName: string;
  wordRegExp: RegExp;

  constructor() {
    this.wordRegExp = /[^\s]+/g;
    this.priority = 100;
    this.providerName = 'url-hyperclick';
  }

  async getSuggestionForWord(textEditor: atom$TextEditor, text: string, range: atom$Range):
    Promise<?HyperclickSuggestion>
  {
    // The match is an array that also has an index property, something that Flow does not appear to
    // understand.
    const match: any = text.match(URL_REGEX);
    if (match == null) {
      return null;
    }

    const [url] = match;
    const index = match.index;
    const matchLength = url.length;

    // Update the range to include only what was matched
    const urlRange = new Range(
      [range.start.row, range.start.column + index],
      [range.end.row,   range.start.column + index + matchLength],
    );

    return {
      range: urlRange,
      callback: () => {
        const {openExternal} = require('shell');
        openExternal(url);
      },
    };
  }
}
