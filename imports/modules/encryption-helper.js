/*
Inspired by: https://gist.github.com/yoavniran/c78a0991e0152b306c25
*/
import { Meteor } from 'meteor/meteor';
import crypto from 'crypto';

class EncryptionHelper {
  static encrypt(text) {
    if (Meteor.isClient === true) {
      throw new Error(`Don't use EncryptionHelper on the client side.`);
    }

    return this.convert({
      text,
      cryptoMethod: 'createCipher',
      fromEncoding: this.settings.ORIGINAL_ENCODING,
      toEncoding: this.settings.ENCRYPTED_ENCODING,
    });
  }

  static decrypt(text) {
    if (Meteor.isClient === true) {
      throw new Error(`Don't use EncryptionHelper on the client side.`);
    }

    return this.convert({
      text,
      cryptoMethod: 'createDecipher',
      fromEncoding: this.settings.ENCRYPTED_ENCODING,
      toEncoding: this.settings.ORIGINAL_ENCODING,
    });
  }

  static convert({text, cryptoMethod, fromEncoding, toEncoding}) {
    if (!crypto[cryptoMethod]) {
      throw new Error(`crypto doesn't have method (${cryptoMethod})`);
    }

    const keyStr = Meteor.settings.private.VIDEO_URL_ENCRYPTION_KEY;
    const key = new Buffer(keyStr);
    const converter = crypto[cryptoMethod](this.settings.ALGORITHM, key);

    let result = converter.update(text, fromEncoding, toEncoding);

    result += converter.final(toEncoding);

    return result;
  }

  static get settings() {
    return {
      ALGORITHM: 'aes-128-cbc',
      ORIGINAL_ENCODING: 'utf8',
      ENCRYPTED_ENCODING: 'base64',
    };
  }
}

export default EncryptionHelper;
