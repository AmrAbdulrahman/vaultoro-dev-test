/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const GIFs = new Mongo.Collection('GIFs');

GIFs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

GIFs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

GIFs.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this GIF belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this GIF was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this GIF was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the GIF.',
  },
  body: {
    type: String,
    label: 'The body of the GIF.',
  },
});

GIFs.attachSchema(GIFs.schema);

export default GIFs;