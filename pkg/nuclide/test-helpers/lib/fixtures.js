'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import ncp from 'ncp';
import path from 'path';
import temp from 'temp';

// Automatically track and cleanup files at exit.
const tempWithAutoCleanup = temp.track();

/**
 * When called from a file in a spec/ directory that has a subdirectory named fixtures/, it copies
 * the specified subdirectory of fixtures into a temp directory. The temp directory will be deleted
 * automatically when the current process exits.
 *
 * @param fixtureName The name of the subdirectory of the fixtures/ directory that should be copied.
 * @param dirname The calling function should call `__dirname` as this argument. This should
 *   correspond to the spec/ directory with a fixtures/ subdirectory.
 */
async function copyFixture(fixtureName: string, dirname: string): Promise<string> {
  // Create a temp directory.
  const tempDir = await new Promise((resolve, reject) => {
    tempWithAutoCleanup.mkdir(fixtureName, (err: ?Error, dirPath) => {
      if (err) {
        reject(err);
      } else {
        resolve(dirPath);
      }
    });
  });

  // Recursively copy the contents of the fixture to the temp directory.
  await new Promise((resolve, reject) => {
    const sourceDirectory = path.join(dirname, 'fixtures', fixtureName);
    ncp(sourceDirectory, tempDir, (err: ?Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  return tempDir;
}

module.exports = {
  copyFixture,
};
